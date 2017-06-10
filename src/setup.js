'use strict';
fs = require('fs');
fs.createReadStream('.env.dist')
  .pipe(fs.createWriteStream('.env'));
