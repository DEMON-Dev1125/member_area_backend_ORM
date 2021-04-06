const Sequelize = require('sequelize');
const db = require('../db');

const Classmodule = db.define('classmodule', {
    group_id:{
        type: Sequelize.INTEGER
    },
    module_id:{
        type: Sequelize.INTEGER
    },
    type: {
        type: Sequelize.STRING, //free, schedule, purchase, hidden block
        allownull: false
    },
    fromdate: {
        type: Sequelize.DATEONLY,
        allownull: false,
    },
    todate: {
        type: Sequelize.DATEONLY,
        allownull: true,
    },
    daysafter: {
        type: Sequelize.INTEGER,
        allownull: true,
    }
}, {
    timestamps: false
});

module.exports = Classmodule;