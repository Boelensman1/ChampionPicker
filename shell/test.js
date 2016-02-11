var im    = require('imagemagick');
var fs    = require('fs');
var util  = require('util');
var async = require('async');

var dir = process.argv[2];

fs.mkdirSync(dir+'-png', 0755);

fs.readdir(dir, function(err, files) {
  if (err) throw err;
  async.filter(files, function(file, done) {
      if (file.match(/[jJ][pP][gG]$/)) { done(true); }
      done(false);
    },
    function(files){
      async.forEachSeries(files, function(file, done) {
           var pngfn = file.replace(/^(.*\.)[jJ][pP][gG]$/, '$1') + "png";
           console.log('converting ' + file + ' to ' + pngfn);
           im.convert(['-verbose', dir + '/' + file, dir + '-png/' + pngfn],
             function(err, stdout) {
               if (err) done(err);
               console.log('stdout:', stdout);
               done();
             });
         }, function(err) {
        // if any of the saves produced an error, err would equal that error
      });
    });
});
