// require modules 
const fs = require('fs');
const archiver = require('archiver');
 
// create a file to stream archive data to. 
var output = fs.createWriteStream(__dirname + '/dist/dist.zip');
var archive = archiver('zip', {
    store: true, // Sets the compression method to STORE. 
    zlib: { level: 9 } // Sets the compression level.
});
 
// listen for all archive data to be written 
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});
 
// good practice to catch this error explicitly 
archive.on('error', function(err) {
  throw err;
});
 
// pipe archive data to the file 
archive.pipe(output);
 
// append a file from stream 
var file1 = __dirname + '/dist/bundle.js';
archive.append(fs.createReadStream(file1), { name: 'bundle.js' });
 
// append files from a directory 
archive.directory('node_modules');
 
// finalize the archive (ie we are done appending files but streams have to finish yet) 
archive.finalize();