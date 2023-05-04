const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Account = require('./Account');

const User = sequelize.define('User', {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  member: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  accountID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Account,
      key: 'accountID',
    },
  },
}, {
  tableName: 'USER',
  timestamps: false,
});

module.exports = User;
