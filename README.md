# nd-mongo
node-dependency plugin to help expose mongoose's collections on a HTTP interface

This [node-dependency](https://github.com/pedroassis/node-dependency) plugin helps you expose Mongo Collection though a HTTP API.

# Installation

```bash
$ npm install nd-mongo --save
```

You also need [node-dependency](https://github.com/pedroassis/node-dependency) and [nd-express-plugin](https://github.com/pedroassis/nd-express-plugin) installed in your project.  

# How it works  

This plugin will depend upon 'MongoModels', so you need to create a file to expose this dependency.  
You can inject a dependency `Mongoose` which is the mongoose object.  

MongoModels.js
```js
function MongoModels (Mongoose) {
    return [{
        schema : {
            name : String
        },
        name : "User",
        url : "/user"
    }];
}

module.exports = MongoModels
```

This function should return and Array containing all your Collections definitions.

A Collection Definition:
```
  schema - used to instantiate a Mongoose Schema.
  name - your collection's name.
  url - the url appended to the server's base url
```

The following Object defines a Collection named 'User' to be served at <base_url>/user with the Schema with a property name of type String.

```js
{
    schema : {
        name : String
    },
    name : "User",
    url : "/user"
}
```

After loading this Object, nd-mongo will setup a few urls to access the Collection's Documents:


# URLs

**Get all Documents:**  
`/user/`  
with method GET - Optional limit and offset url parameters  
Example:
```
    curl -H "Content-Type: application/json" -X GET http://localhost:9999/user?limit=1&offset=2
```

**Update a Document:**  
`/user/`  
with method PUT, requires a request body - The body should contain _id prop and the properties to update  

**Create a Document:**  
`/user/`  
with method POST, requires a request body - The body will be saved as a new Document  
Example:
```
    curl -H "Content-Type: application/json" -X POST -d '{"name":"Soem Name"}' http://localhost:9999/user/
```
 
**Get by ID:**  
`/user/:id`  
with method GET, requires id  
Example:
```
    // This will get the Document with _id `559563e4670059eb769fdbd3`
    curl -H "Content-Type: application/json" -X GET http://localhost:9999/user/559563e4670059eb769fdbd3
```

**Delete a Document:**  
`/user/:id`  
with method DELETE, requires id of the Document to be deleted
Example:
```
    // This will delete the Document with _id `559563e4670059eb769fdbd3`
    curl -H "Content-Type: application/json" -X DELETE http://localhost:9999/user/559563e4670059eb769fdbd3
```
 
**Find Documents:**  
`/user/find`  
with method POST, requires a request body which will be used as a mongoose query - Optional limit and offset url parameters  
Example:
```
    // This will query for all Documents with name 'Some Name'
    curl -H "Content-Type: application/json" -X POST -d '{"name":"Some Name"}' http://localhost:9999/user/find
```

