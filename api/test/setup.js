// Force istanbul to make coverage off all files.
// Not just the files that have been required.

const glob = require('glob');
const path = require('path');
glob(__dirname + '/../src/**/*.js', (err, files) => {
  files.map((file) => {
    if (path.basename(file) !== 'app.js') {
      require(file);
    }
  });
});

global.chai = require('chai');
global.expect = global.chai.expect;
global.spyOn = global.expect.spyOn;
