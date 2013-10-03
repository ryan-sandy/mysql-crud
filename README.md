mysql-crud
==========

Simple CRUD operations for felixge/node-mysql.

Mysql-crud dynamically creates an object that allows you to perform CRUD operations on the specified connection pool and table. Mysql-Crud is NOT an ORM. You cannot use it across multiple tables or for more complicated queries. It is meant to a be a short hand for simple INESRT, SELECT, UPDATE, and DELETE queries on a single table.

Table of Contents:

* [Initialization](https://github.com/ryan-sandy/mysql-crud#initialization)
* [Create](https://github.com/ryan-sandy/mysql-crud#create)
* [Load (Retrieve)](https://github.com/ryan-sandy/mysql-crud#load-retreive)
* [Update](https://github.com/ryan-sandy/mysql-crud#update)
* [Destroy](https://github.com/ryan-sandy/mysql-crud#destroy)
* [Advanced](https://github.com/ryan-sandy/mysql-crud#advanced-usage)

##Initialization:
In-order to create a crud-object you must called the mysql-crud function with two parameters: a mysql connection pool and the table name.

```javascript
var mysql = require('mysql');                
var db = mysql.createPool();
var CRUD = require('mysql-crud');
var user-crud = CRUD(db, 'users');
//user-crud will now have the four functions
```

##Create

`create(attributes, callback)`

This function will perform the INSERT INTO query. It will escape the `attributes` object into `SET <key> : <value>`. Once the insert is complete it will call the callback with the node-mysql callback (err, and rows). 

```javascript
user-crud.create({'id' : 1, 'username' : 'test', 'password' : '1234'}, function (err, vals) {
	//mysql callback
});
```

##Load (Retreive)

`load(selector, callback, [options])`

This function will SELECT all the rows that are equal to selector key-value. The keys are the columns and the values are the values to select against. If the selector contains multiple keys-value pairs, these will be escaped into multiple equal statements joined together with `AND`. An empty selector object ({}) will be escaped to `WHERE 1`;

The `options` parameter is an object that may contain two properties, `limit` and `offset`. These will be escaped into their respective MySQL `LIMIT` and `OFFEST` clauses. Note, an offset without a limit will be ignored.

Example:
```javascript
user-crud.load({'first-name' : 'mysql', 'last-name' : 'crud'}, callback);
//SELECT * FROM 'users' WHERE 'first-name' = "mysql" AND 'last-name' = "CRUD"
//optionally
user-crud.load({}, callback, {'limit' : 25, 'offset' : 10});
//SELECT * FROM `users` WHERE 1 LIMIT 25 OFFSET 10

//offset with out limit is ignored
user-crud.load({}, callback, {'offset' : 10});
//SELECT * FROM `users` WHERE 1
```


##Update:

`update(selector, values, callback)`

This function will run the UPDATE query. It will update all rows where the selector is true to the values in the values object.

##Destroy

`destroy(selector, callback)`

This function will run the DELTE FROM query based on the selectors. Use with caution.


##Advanced Usage

If you are using the MVC model you can create custom functions or default values for your crud command:

```javascript
/*model/user.js*/
var db = require('your-database-pool.js');
var crud = require('crud')(db, 'users');

exports.create = function (attrs, callback) {
	if (attrs.password !== undefined) {
		attrs.password = hash(attrs.password);
	}
	crud(attrs, callback);
};
exports.load = crud.load;
exports.update = crud.update;
exports.destroy = crud.destroy;
```

##AndEscape

`crud.andEscape(queryString, obj)`

Replaces `??` in queryString with `key = values AND key2 = values2` from the `obj` parameter. Escapes obj using node-mysql escape method.


License
====
The MIT License (MIT)

Copyright (c) 2013 Ryan Lee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Contributors
====

* Ryan Lee
* Stephen Wan
