const express = require('express');
const app = express();
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    port: 3306,
    username: 'root',
    dialect: 'mysql',
    password: 'Shotput12?',
    database: 'housing-grants',
    define: {
    createdAt: false,
    updatedAt: false
    },
    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
    })
    .catch(err => {
    console.error('Unable to connect to the database:', err);
    });


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Household = sequelize.import('./tables/Household.js');
db.Member = sequelize.import('./tables/Member.js');
db.Household.hasMany(db.Member, { foreignKey: 'h_id' });

module.exports= db;