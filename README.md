# Automod
Module loading and name-spacing for Node.js app.s

# Installation
`npm install --save-dev automod`

# What
Autmod helps you expose and use modules within your app. With node's exports system, it effectively becomes a dependecy injection module.

# Why
One day I got sick of writing the same require statements everywhere.

# How

##### In your server's entry file:
***

    var mods = require('automod');

    mods({ignore: [], data: {}, path: ''});

1. Ignore
   Automod will examine all directories startiing on the same directory as your entry file and try and `require` them.

2. Data
   This is to pass other `required` modules to your modules. Consider:

       var mods = require('automod');
       var mongo = require('mongodb');

       var persistence = {
          Db: mongo.Db,
          Server: mongo.Server,
          Connection: mongo.Connection
       };

       mods({ignore: [], data: persistence, path: ''});

  Now the persistence data will be available in you module.

 ##### In your modules:
 ***

 A sample users module

     module.exports = function(app) {
      var Users = app.data.persistence.Db.collection('users');
        
     };