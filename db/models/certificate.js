const Sequelize = require('sequelize');
const db = require('../db');

const Certificate = db.define('certificate', {
    contentDetail: {
        type: Sequelize.STRING,
        allownull: false
    }
}, {
    timestamps: false
});

module.exports = Certificate;