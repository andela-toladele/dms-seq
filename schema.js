var Sequelize = require('sequelize');

var sequelize = new Sequelize("postgres://postgres:postgres@localhost:5432/postgres");

var User = sequelize.define('User', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: Sequelize.JSON,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

var Role = sequelize.define('Role', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }

});

var Document = sequelize.define('Document', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ownerId: {
    type: Sequelize.INTEGER
  },
  title: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.STRING
  }
}, {
  createdAt: 'dateCreated',
  updatedAt: 'lastModified'
});


var DocumentRole = sequelize.define('DocumentRole');


User.belongsTo(Role);

Document.belongsTo(User, {
  foreignKey: 'ownerId'
});

Document.belongsToMany(Role, {
  through: DocumentRole,
  foreignKey: 'DocumentId'
});

Role.belongsToMany(Document, {
  through: DocumentRole,
  foreignKey: 'RoleId'
});

Document.hasMany(DocumentRole);
Role.hasMany(DocumentRole);

module.exports = {
  User: User,
  Role: Role,
  Document: Document,
  DocumentRole: DocumentRole,
  sequelize: sequelize
}
