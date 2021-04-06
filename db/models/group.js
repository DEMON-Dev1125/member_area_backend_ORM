const Sequelize = require('sequelize');
const db = require('../db');

const Group = db.define('group', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allownull: false
    },
    accessterm: {
        type: Sequelize.INTEGER,
        allownull: false,
    },
    standardclass: {
        type: Sequelize.STRING,
        allownull: true,
    }
}, {
    timestamps: false
});

module.exports = Group;