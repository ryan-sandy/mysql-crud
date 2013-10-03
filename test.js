//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/

var crud = require('./crud.js');
var assert = require('assert');

var DB = function (testCase) {
  this.connection = {
    'release' : function () {},
    'query' : testCase
  };
};
DB.prototype.getConnection = function (cb) {
  cb(null, this.connection);
};

describe('Load', function () {
  it('should load a single object', function (done) {
    var db = new DB(function (query, cb) {
      assert.strictEqual(query, 'SELECT * FROM `users` WHERE `id` = 1');
      cb();
    });
    crud(db, 'users').load({'id' : 1}, function (err, val) {
      done();
    });
  });
  it('should load an object with two keys', function (done) {
    var db = new DB(function (query, cb) {
      assert.strictEqual(query, 'SELECT * FROM `users` WHERE `id` = 1 AND `username` = \'crud\'');
      cb();
    });
    crud(db, 'users').load({'id' : 1, 'username' : 'crud'}, function (err, val) {
      done();
    });
  });
  it('should throw an error with non object', function (done) {
    var db = new DB(function (query, cb) {
      cb();
    });
    crud(db, 'users').load(1, function (err, val) {
      assert.throws(err);
      done();
    });
  });
  it('should escape an empty object', function (done) {
    var db = new DB(function (query, cb) {
      assert.strictEqual(query, 'SELECT * FROM `users` WHERE 1');
      cb();
    });
    crud(db, 'users').load({}, function (err, val) {
      done();
    });
  });
});

//Because we tested the andEscape function with the create function we're not
//going to bother retesting all the andEscape behavior
//nor are we going to test mysql escape.
describe('Create', function () {
  //Mysql.escape in use.
  it('should create an object', function (done) {
    var db = new DB(function (query, attrs, cb) {
      assert.strictEqual(query, 'INSERT INTO `users` SET ?');
      cb();
    });
    crud(db, 'users').create({'id' : 1}, function (err, vals) {
      done();
    });
  });
});

describe('Update', function () {
  it('should update an object', function (done) {
    var db = new DB(function (query, attrs, cb) {
      assert.strictEqual(query, 'UPDATE `users` SET ? WHERE `id` = 1');
      cb();
    });
    crud(db, 'users').update({'id' : 1}, {}, function (err, val) {
      done();
    });
  });
  it('should return an error', function (done) {
    var db = new DB(function (query, attrs, cb) {
      cb();
    });
    crud(db, 'users').update({'id' : 1}, {}, function (err, val) {
      assert.throws(err);
      done();
    });
  });
});

describe('Delete', function () {
  it('should delete an object', function (done) {
    var db = new DB(function (query, cb) {
      assert.strictEqual(query, 'DELETE FROM `users` WHERE `id` = 1');
      cb();
    });
    crud(db, 'users').destroy({'id' : 1}, function (err, val) {
      done();
    });
  });
  it('should return an error', function (done) {
    var db = new DB(function (query, cb) {
      cb();
    });
    crud(db, 'users').destroy({'id' : 1}, function (err, val) {
      assert.throws(err);
      done();
    });
  });
});
