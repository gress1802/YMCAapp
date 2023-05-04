const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Program = require('./Program');
const User = require('./User');
const Account = require('./Account');

const Registration = sequelize.define('Registration', {
  registrationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  programID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Program,
      key: 'programID',
    },
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
  tableName: 'REGISTRATION',
  timestamps: false,
});

Registration.associate = (models) => {
  Registration.belongsTo(models.Program, {
    foreignKey: 'programID',
  });
  Registration.belongsTo(models.Account, {
    foreignKey: 'accountID',
  });
}

module.exports = Registration;
