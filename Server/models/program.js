const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Registration = require('./registration');

const Program = sequelize.define('Program', {
  programID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  endDate: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  day: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  memberPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nonMemberPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  numParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING(500),
    allowNull: false,
  }
}, {
  tableName: 'PROGRAM',
  timestamps: false,
});

Program.associate = (models) => {
  Program.hasMany(models.Registration, {
    foreignKey: 'programID',
  });
}

module.exports = Program;
