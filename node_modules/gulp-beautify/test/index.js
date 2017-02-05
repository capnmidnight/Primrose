var beautify = require('../');
var should = require('should');
var File = require('vinyl');
require('mocha');

describe('gulp-beautify', function() {
  describe('beautify()', function() {
    it('should concat two files', function(done) {
      var stream = beautify({indent_size: 2});
      var fakeFile = new File({
        path: '/home/contra/test/file.js',
        base: '/home/contra/test/',
        cwd: '/home/contra/',
        contents: new Buffer('function test(){console.log("test");}')
      });

      var expected = "function test() {\n  console.log(\"test\");\n}";
      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal('/home/contra/test/file.js');
        newFile.relative.should.equal('file.js');
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });
  });
});
