'use strict';

// load dependencies
var fs = require('fs');
const q = require('q');
var httpreq = require('httpreq');
var jsonfile = require('jsonfile');
var im    = require('imagemagick');
var Imagemin = require('imagemin');
var mozjpeg = require('imagemin-mozjpeg');

// load project files
const cli = require('./cli');
const models = require('../models');

// load config
const config =require('../config');

// function to call at the end
let cb;

// path to images
const iconLocation = '../../img/icons/';
const splashLocation = '../../img/splashes/';
const dataLocation = '../../data/';

const util = require("util");


function getRoleId(roleName) {
  switch(roleName) {
      case 'Top':
          return 0;
      case 'Jungle':
          return 1;
      case 'Middle':
          return 2;
      case 'ADC':
          return 3;
      case 'Support':
          return 4;
      default:
          throw Error('Role ' + roleName + 'not found.')
          cb();
          return;
  }
}

function getLinkURL(linkName, links) {
  let url = -1;
  links.forEach(function(link) {
    if (link.name == linkName) {
      url = link.url;
    }
  });
  if (url == -1) {
    throw new Error('Link name ' + linkName + ' not found!');
    cb();
  }
  return url;
}


function download(url, dest, callback) {
  httpreq.get(url, {binary: true}, function (err, res){
    if (err){
      console.log(err);
      cb();
    } else {
      fs.writeFile(dest, res.body, function (err) {
        if(err) {
          console.log("error writing file");
          cb();
        } else {
          callback();
        }
      });
    }
  });
}

function processChampion(champion) {
  return q.Promise(function(resolve, reject, notify) {
    let champ = champion.get();
    champ.namelower = champ.name.toLowerCase();
    champ.nameShort = champ.name.replace(/\W/, ''); // remove spaces
    champ.iconUrl = champ.championIcon.url; // remove spaces
    champ.splashUrl = champ.championSplash.url; // remove spaces
    champ.description = champ.lore;

    champ.roles = []
    champ.positions.forEach(function(position) {
      champ.roles.push(getRoleId(position.get('position')));
    });

    champ.mobafireURL = getLinkURL('mobafire', champ.links);
    champ.championggURL = getLinkURL('championgg', champ.links);
    champ.probuildsURL = getLinkURL('probuilds', champ.links);
    champ.lolwikiURL = getLinkURL('lolwiki', champ.links);

    // remove extra paremeters
    delete champ.links;
    delete champ.positions;
    delete champ.championIcon;
    delete champ.championSplash;
    delete champ.lore;

    // download images
    download(champ.iconUrl, iconLocation + champ.nameShort + '.png', function(err) {
      process.stdout.write('.');
      download(champ.splashUrl, splashLocation + champ.nameShort + '.jpg', function(err) {
        process.stdout.write('.');
        resolve(champ);
      });
    })
  });
}

function convert(from, to) {
  return q.Promise(function(resolve, reject, notify) {
    im.convert([from, to], function(err, stdout){
      if (err) {
        reject(err)
      }
      else {
        //remove old file
        fs.unlink(from, resolve);
      }
    });
  });
}

function changeSize(from, to, size) {
  return q.Promise(function(resolve, reject, notify) {
    im.convert([from, '-resize', size, to], function(err, stdout){
      if (err) {
        reject(err)
      }
      else {
        resolve();
      }
    });
  });
}

function convertChampionsImageToJPG(champions, dir) {
  return q.Promise(function(resolve, reject, notify) {

    const promises = [];

    Object.keys(champions).forEach(function(key) {
      var champion = champions[key];
      const path = dir + champion.nameShort + '.png';
      const pathTo = dir + champion.nameShort + '.jpg';
      process.stdout.write('.');
      promises.push(convert(path, pathTo));
    });

    q.allSettled(promises).then(resolve);
  });
}

function changeChampionsImageSize(champions, dir, extention, size) {
  return q.Promise(function(resolve, reject, notify) {

    const promises = [];

    Object.keys(champions).forEach(function(key) {
      var champion = champions[key];
      const path = dir + champion.nameShort + extention;
      process.stdout.write('.');
      promises.push(changeSize(path, path, size));
    });

    q.allSettled(promises).then(resolve);
  });
}
function optimizeIcons(champions, iconLocation) {
  return q.Promise(function(resolve, reject, notify) {
    changeChampionsImageSize(champions, iconLocation, '.png', '70x70').then(function() {
      convertChampionsImageToJPG(champions, iconLocation).then(function() {
        new Imagemin()
        .src(iconLocation + '*.jpg')
        .dest(iconLocation)
        .use(mozjpeg({progressive: true}))
        .run(function (err, files) {
          process.stdout.write('.');
          resolve();
        });
      });
    });
  });
}

function optimizeSplashes(champions, iconLocation) {
  return q.Promise(function(resolve, reject, notify) {
    changeChampionsImageSize(champions, splashLocation, '.jpg', '40%').then(function() {
      new Imagemin()
      .src(splashLocation + '*.jpg')
      .dest(splashLocation)
      .use(mozjpeg({progressive: true}))
      .run(function (err, files) {
        process.stdout.write('.');
        resolve();
      });
    });
  });
}

function optimize(champions, iconLocation, splashLocation)
{
  return q.allSettled(
    optimizeIcons(champions, iconLocation),
    optimizeSplashes(champions, splashLocation)
  );
}

function processChampions(championsInDb) {
  return q.Promise(function(resolve, reject, notify) {
    // the files we need to create
    const champions = {};
    const order = [];
    const roles = [[], [], [], [], []];
    const promises = [];

    championsInDb.forEach(function(champion) {
      promises.push(processChampion(champion));
    });

    q.allSettled(promises)
    .then(function(results) {
      process.stdout.write('postprocessing');
      results.forEach(function (result) {
        process.stdout.write('.');
        if (result.state === "fulfilled") {
          var champ = result.value;

          champions[champ.riotId] = champ;
          order.push(champ);

          champ.roles.forEach(function(role) {
            roles[role].push(champ.riotId);
          });
        } else {
          console.log(result);
        }
      });

      //sort order so it is actually in order
      process.stdout.write('ordering');
      order.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });

      order.forEach(function(champion, key) {
        process.stdout.write('.');
        order[key] = champion.riotId;
      });


       process.stdout.write('writing');
       jsonfile.writeFileSync(dataLocation + 'champions.json', champions);
       process.stdout.write('...');
       jsonfile.writeFileSync(dataLocation + 'order.json', order);
       process.stdout.write('...');
       jsonfile.writeFileSync(dataLocation + 'roles.json', roles);
       process.stdout.write('...');

       process.stdout.write('optimizing');
       optimize(champions, iconLocation, splashLocation).then(function() {
         resolve();
       });

    }).catch(reject)
  });
}

module.exports = {
  do_update: function do_update(subcmd, opts, args, end) {
    // make end function global
    cb = end;

    process.stdout.write('syncing');
    models.sequelize.sync().then(function() {
      process.stdout.write('..loading');
      models.champion.findAll({include: [{ all: true }]}).then(function(championsInDb) {
        process.stdout.write('..processing');
        processChampions(championsInDb).then(function() {
          console.log('done');
          cb();
        }).catch(function(error) {
          console.log(error);
          cb();
        })
      });
    });
  },
  help: 'Help message'
};
process.on('uncaughtException', function(err) {
  cli.output((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});
