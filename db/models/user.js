const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allownull: true
    },
    username: {
        type: Sequelize.STRING,
        allownull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allownull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allownull: false
    },
    membertype:{
        type: Sequelize.STRING
    },
    group:{
        type: Sequelize.INTEGER,
        allownull: false,
    },
    blocked:{
        type: Sequelize.BOOLEAN,
        default: false
    }
}, {
    timestamps: false
});

module.exports = User;