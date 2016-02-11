// cli.js
// ========
/* vim: set ts=4 sw=4 tw=0 noet : */
var debug = false;
module.exports = {
    setDebug: function(enable_debug) {
        debug = enable_debug;
    },
    debug: function(output) {
        //only output is debug is on
        //if (debug) {
          if (true) {
            console.log(output);
          }
    },
    output: function(output) {
        console.log(output);
    },
};
