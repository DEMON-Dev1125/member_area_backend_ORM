const Sequelize = require("sequelize");
const db = require("../db");

const Setting = db.define(
  "setting",
  {
    memberareaname: {
      type: Sequelize.STRING,
      unique: true,
      allownull: false,
    },
    contactemail: {
      type: Sequelize.STRING,
      allownull: true,
    },
    domain: {
      type: Sequelize.STRING,
      allownull: true,
    },
    lang: {
      type: Sequelize.STRING,
      allownull: false,
    },
    timezone: {
      type: Sequelize.STRING,
      allownull: true,
    },
    emailsubject: {
      type: Sequelize.STRING,
      allownull: true,
    },
    message: {
      type: Sequelize.STRING,
      allownull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Setting;
