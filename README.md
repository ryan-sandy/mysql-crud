mysql-crud
==========

Simple CRUD operations for felixge/node-mysql.

Mysql-crud dynamically creates an object that allows you to perform CRUD operations on the specified connection pool and table. Mysql-Crud is NOT an ORM. You cannot use it across multiple tables or for more complicated queries. It is meant to a be a short hand for simple INESRT, SELECT, UPDATE, and DELETE queries on a single table.

Table of Contents:

* [Usage](https://github.com/ryan-sandy/mysql-crud#usage)
* [Create](https://github.com/ryan-sandy/mysql-crud#create)
* [Load (Retrieve)](https://github.com/ryan-sandy/mysql-crud#load-retreive)
* [Update](https://github.com/ryan-sandy/mysql-crud#update)
* [Destroy](https://github.com/ryan-sandy/mysql-crud#destroy)
* [Advanced](https://github.com/ryan-sandy/mysql-crud#advanced-usage)

##Usage:
In-order to create a crud-object you must called the mysql-crud function with two parameters: a mysql connection pool and the table name your object. Remember, mysql-crud only performs work on a single table.

```javascript
var mysql = require('mysql');                
var db = mysql.createPool();
var CRUD = require('mysql-crud');
var user-crud = CRUD(db, 'users');
//user-crud will now have the four functions
```

##Create

`create(attributes, callback)`

This function will perform the INSERT INTO query on the specified table. It will set the values equal to the first parameter and then call the callback. The callback is the standard mysql callback (err, and rows). 

```javascript
user-curd.create({'id' : 1, 'username' : 'test', 'password' : '1234'}, function (err, vals) {
	//mysql callback
});
```

##Load (Retreive)

`load(selector, callback)`

This function will SELECT all the rows that match the selector key-value. Multiple keys will be considered AND in the WHERE clause.

Example:
```javascript
user-crud.load({'first-name' : 'mysql', 'last-name' : 'crud'}, callback);
//SELECT * FROM 'users' WHERE 'first-name' = "mysql" AND 'last-name' = "CRUD"
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
