/*
 * PLEASE DO NOT DEMO THIS FILE IN CLASS
*/

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ymca', 'gress2123', 'Wordpass12345!', {
  host: 'cs341.mysql.database.azure.com',
  dialect: 'mysql',
  dialectOptions: {
        ssl: {
        require: true,
        // Do not reject unauthorized certificates, Azure does not provide a CA certificate
        rejectUnauthorized: false
        }
    }
});


module.exports = sequelize;
