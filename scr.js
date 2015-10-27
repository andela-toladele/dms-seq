require('shelljs/make');

var DocumentManager = require('./documentManager');

var documentManager = new DocumentManager();

target.clearDB = function(args) {
  documentManager.syncDatabase().then(function() {
    echo('Database cleared!');
    exit(0);
  });
}


target.createUser = function(args) {

  if (!args || args.length < 3) {
    echo('Add input params in this format: -- username email password');
    exit(0);
  }

  documentManager.createUser({
      username: args[0],
      email: args[1],
      password: args[2]
    })
    .then(function(user) {
      echo(user.get({
        plain: true
      }));
      exit(0);
    }).catch(function(err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        echo('Duplicate username or email found');
        exit(0);
      } else {
        echo('Error occured');
        exit(0);
      }
    });
}

target.getAllUsers = function() {

  documentManager.getAllUsers()
    .then(function(users) {
      echo('[\n');
      users.forEach(function(user) {
        echo(user.get({
          plain: true
        }));
      });
      echo('\n]');
      exit(0);
    }).catch(function(err) {

      echo('Error occured');
      exit(0);
    });
}

target.createRole = function(args) {

  if (!args || !args.length) {
    echo('Add input params in this format: -- roleTitle');
    exit(0);
  }

  documentManager.createRole({
      title: args[0]
    })
    .then(function(role) {
      echo(role.get({
        plain: true
      }));
      exit(0);
    }).catch(function(err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        echo('Duplicate title found');
        exit(0);
      } else {
        echo('Error occured');
        exit(0);
      }
    });
}

target.getAllRoles = function() {

  documentManager.getAllRoles()
    .then(function(roles) {
      echo('[\n');
      roles.forEach(function(role) {
        echo(role.get({
          plain: true
        }));
      });
      echo('\n]');
      exit(0);
    }).catch(function(err) {

      echo('Error occured');
      exit(0);
    });
}

target.createDocument = function(args) {

  if (!args || args.length < 2) {
    echo('Add input params in this format: -- title content [dateCreated] [createdBy]');
    exit(0);
  }

  var doc = {
    title: args[0],
    content: args[1]
  };

  var createdBy = args[3];

  if (args[2]) {

    if (args[2].indexOf('-') > -1) {
      var dateArr = args[2].split("-");
      doc.dateCreated = new Date(dateArr[0], dateArr[1], dateArr[2]);
    }else{
      createdBy = args[2];
    }
  }


  documentManager.createDocument(doc, createdBy)
    .then(function(doc) {
      echo(doc.get({
        plain: true
      }));
      exit(0);
    }).catch(function(err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        echo('Duplicate title found');
        exit(0);
      } else {
        echo('Error occured');
        exit(0);
      }
    });
}

target.getAllDocuments = function(args) {

  documentManager.getAllDocuments(args ? args[0] : 0)
    .then(function(docs) {
      echo('[\n');
      docs.forEach(function(doc) {
        echo(doc.get({
          plain: true
        }));
      });
      echo('\n]');
      exit(0);
    }).catch(function(err) {

      echo('Error occured');
      exit(0);
    });
}

target.addDocumentRole = function(args) {

  if (!args || args.length < 2) {
    echo('Add input params in this format: -- docId roleTitle');
    exit(0);
  }

  documentManager.addDocumentRole(args[0], args[1])
    .then(function() {
      echo('Role added!');
      exit(0);
    }).catch(function(err) {
      echo('Error occured');
      exit(0);
    });
}

target.getDocumentsByRole = function(args) {

  if (!args) {
    echo('Add input params in this format: -- roleTitle');
    exit(0);
  }

  documentManager.getAllDocumentsByRole(args[0])
    .then(function(docs) {
      echo('[\n');
      docs.forEach(function(doc) {
        echo(doc.get({
          plain: true
        }));
      });
      echo('\n]');
      exit(0);
    }).catch(function(err) {

      echo('Error occured');
      exit(0);
    });
}

target.getDocumentsByDate = function(args) {

  if (!args) {
    echo('Add input params in this format: -- date');
    exit(0);
  }

  documentManager.getAllDocumentsByDate(args[0])
    .then(function(docs) {
      echo('[\n');
      docs.forEach(function(doc) {
        echo(doc.get({
          plain: true
        }));
      });
      echo('\n]');
      exit(0);
    }).catch(function(err) {

      echo('Error occured');
      exit(0);
    });
}
