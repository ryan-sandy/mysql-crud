//Copyright 2013 Ryan Lee
//MIT License

'use strict';
/*jslint node:true, indent:2, nomen:true*/

var mysql = require('mysql');

var andEscape = function (query, values) {
  return query.replace(/\?\?/g, function (txt) {
    if ((typeof values) !== 'object') {
      throw new Error("Can only escape objects");
    }
    var rtn = [],
      key = '',
      cnt = 0;
    for (key in values) {
      if (values.hasOwnProperty(key)) {
        cnt += 1;
        rtn.push(mysql.escapeId(key) + ' = ' + mysql.escape(values[key]));
      }
    }
    if (cnt === 0) {
      return '1';
    }
    return rtn.join(' AND ');
  });
};

module.exports = function (db, table) {
  table = mysql.escapeId(table);
  return {
    'create' : function (attrs, next) {
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        connection.query("INSERT INTO " + table + " SET ?", attrs, function (err, rows) {
          connection.release();
          next(err, rows);
        });
      });
    },
    'load' : function (attrs, next, opts) {
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        var query;
        try {
          query = andEscape("SELECT * FROM " + table + " WHERE ??", attrs);
        } catch (e) {
          return next(e);
        }
        if (opts && opts.limit) {
          query += ' LIMIT ' + mysql.escape(opts.limit);
        }
        if (opts && opts.limit && opts.offset) {
          query += ' OFFSET ' + mysql.escape(opts.offset);
        }
        connection.query(query, function (err, rows) {
          connection.release();
          next(err, rows);
        });
      });
    },
    'update' : function (sel, attrs, next) {
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        var query;
        try {
          query = andEscape('UPDATE ' + table + " SET ? WHERE ??", sel);
        } catch (e) {
          return next(e);
        }
        connection.query(query, attrs, function (err, rows) {
          connection.release();
          next(err, rows);
        });
      });
    },
    'destroy' : function (attrs, next) {
      db.getConnection(function (conErr, connection) {
        if (conErr) { return next(conErr); }
        var query;
        try {
          query = andEscape("DELETE FROM " + table + " WHERE ??", attrs);
        } catch (e) {
          return next(e);
        }
        connection.query(query, function (err, rows) {
          connection.release();
          next(err, rows);
        });
      });
    },
    'andEscape' : andEscape
  };
};
