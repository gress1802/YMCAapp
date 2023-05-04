//Sequelize model for the Family table in the database
const { Sequelize, DataTypes } = require('sequelize');
const Account = require('./account');
const sequelize = require('../db');

const Family = sequelize.define('Family', {
  familyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  accountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Account,
      key: 'accountID',
    },
  },
}, {
  tableName: 'Family',
  timestamps: false,
});

Family.associate = function(models) {
  Family.hasMany(models.FamilyMember, {
    foreignKey: 'familyID',
  });
};


module.exports = Family;
