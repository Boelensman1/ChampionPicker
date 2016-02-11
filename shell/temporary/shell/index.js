/* vim: set ts=2 sw=2 tw=0 expandtab: */

// load required libraries
const cmdln = require('cmdln');
const util = require('util');

// set cli
function Shell() {
  cmdln.Cmdln.call(this, {
    name: 'Shell',
    desc: 'The commandline interface to random2'
  });
}

util.inherits(Shell, cmdln.Cmdln);


Shell.prototype.do_update = require('./index-update.js').do_update;
Shell.prototype.do_update.help = require('./index-update.js').help;

cmdln.main(new Shell());  // mainline
