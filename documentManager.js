var models = require('./schema');

DocumentManager = function() {}

//Drop all database columns and create new tables specified in the schema file
DocumentManager.prototype.syncDatabase = function() {

  return models.sequelize.sync({
    force: true
  });
}

//Create a new user and assign default guest role to the user
DocumentManager.prototype.createUser = function(user) {

  return models.User.create(user).then(function(newUser) {

    return models.Role.findOne({
      where: {
        title: 'guest'
      }
    }).then(function(role) {

      if (!role) {

        return models.Role.create({
          title: 'guest'
        }).then(function(role) {

          return newUser.setRole(role);
        });
      } else {

        return newUser.setRole(role);
      }
    });
  });
}

//Returns all users
DocumentManager.prototype.getAllUsers = function() {

  return models.User.findAll();
}

//Create a new role
DocumentManager.prototype.createRole = function(role) {

  return models.Role.create(role);
}

//Returns all roles
DocumentManager.prototype.getAllRoles = function() {

  return models.Role.findAll();
}

//Create a new document object, assigning ownerId to the document, based
//on the username passed as createdBy param
DocumentManager.prototype.createDocument = function(document, createdBy) {

  return models.Document.create(document).then(function(newDocument) {

    return models.User.findOne({
      where: {
        username: createdBy
      }
    }).then(function(user) {

      return newDocument.setUser(user).then(function(userDoc) {
        return userDoc;

      });

    });

  });
}

//Add role to a document avoiding duplicate with addToSet option
DocumentManager.prototype.addDocumentRole = function(docId, roleTitle) {


  return models.Document.findOne({
    where: {
      id: docId
    }
  }).then(function(doc) {

    return models.Role.findOne({
      where: {
        title: roleTitle
      }
    }).then(function(role) {

      return doc.addRole(role);
    });

  });

}

//Return at most (limit) number of documents in descending order of date created
DocumentManager.prototype.getAllDocuments = function(limit) {

  if (limit) {
    return models.Document.findAll({
      limit: limit,
      order: [
        ["dateCreated", "DESC"]
      ]
    });
  } else {
    return models.Document.findAll({
      order: [
        ["dateCreated", "DESC"]
      ]
    });
  }
}

//Get all documents containing the role specified and in order of date created
DocumentManager.prototype.getAllDocumentsByRole = function(roleTitle, limit) {

  return models.Role.findOne({
    where: {
      title: roleTitle
    }
  }).then(function(role) {

    return models.Document.findAll({

      include: [{
        model: models.DocumentRole,
        where: {
          'RoleId': role.get({
            plain: true
          }).id
        }
      }],
      limit: limit,
      order: [
        ["dateCreated", "DESC"]
      ]
    });
  });
}

//Get all documents created on the date specified
DocumentManager.prototype.getAllDocumentsByDate = function(date) {

  if (typeof date === 'string') {

    var dateArr = date.split('-');
    
    if (dateArr.length > 2) {
      date = new Date(dateArr[0], dateArr[1], dateArr[2]);
    } else {
      date = Date.now();
    }
  }

  return models.Document.findAll({

    where: {
      dateCreated: date
    }
  })
}

module.exports = DocumentManager;
