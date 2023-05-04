const { DataTypes } = require('sequelize');
const Family = require('./family');
const Account = require('./account');
const sequelize = require('../db');

const FamilyMember = sequelize.define('FamilyMember', {
  familyID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Family,
      key: 'familyID',
    },
  },
  accountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Account,
      key: 'accountID',
    },
  },
}, {
  tableName: 'family_member',
  timestamps: false,
});

FamilyMember.associate = function(models) {
  FamilyMember.belongsTo(models.Family, { foreignKey: 'familyID' });
  FamilyMember.belongsTo(models.Account, { foreignKey: 'accountID' });
};

module.exports = FamilyMember;
