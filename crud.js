//Copyright 2012 ERAS/Educational Research and Services
//Reproduction of this material strictly prohibited.
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/

var mysql = require('mysql');

var andEscape = function (query, values) {
  return query.replace(/\?\?/g, function (txt) {
    if ((typeof values) !== 'object') {
      throw new Error("Can only escape objects");
    }
    var rtn = [],
      key = '';
    for (key in values) {
      if (values.hasOwnProperty(key)) {
        rtn.push(mysql.escapeId(key) + ' = ' + mysql.escape(values[key]));
      }
    }
    return rtn.join(' AND ');
  });
};


module.exports = function (db, table) {
  table = mysql.escapeId(table);
  return {
    'create' : function (attrs, next) {
      if (attrs.dateCreated === undefined) {
        attrs.dateCreated = new Date();
      }
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        connection.query("INSERT INTO " + table + " SET ?", attrs, function (err, rows) {
          connection.end();
          next(err, rows);
        });
      });
    },
    'load' : function (attrs, next) {
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        connection.query(andEscape("SELECT * FROM " + table + " WHERE ??", attrs), function (err, rows) {
          connection.end();
          next(err, rows);
        });
      });
    },
    'update' : function (sel, attrs, next) {
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        connection.query(andEscape('UPDATE ' + table + " SET ? WHERE ??", sel), attrs, function (err, rows) {
          connection.end();
          next(err, rows);
        });
      });
    },
    'destroy' : function (attrs, next) {
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        connection.query(andEscape("DELETE FROM " + table + " WHERE ??", attrs), function (err, rows) {
          connection.end();
          next(err, rows);
        });
      });
    }
  };
};
