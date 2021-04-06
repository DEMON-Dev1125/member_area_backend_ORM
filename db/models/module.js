const Sequelize = require('sequelize');
const db = require('../db');

const Module = db.define('module', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allownull: false
    },
    order: {
        type: Sequelize.INTEGER,
        allownull: false,
        default: -1
    }
}, {
    timestamps: false
});

module.exports = Module;