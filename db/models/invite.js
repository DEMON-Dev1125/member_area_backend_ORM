const Sequelize = require("sequelize");
const db = require("../db");

const Invite = db.define(
  "invite",
  {
    title: {
      type: Sequelize.STRING,
      unique: true,
      allownull: false,
    },
    description: {
      type: Sequelize.STRING,
      allownull: true,
    },
    file: {
      type: Sequelize.STRING,
      allownull: true,
    },
    link: {
      type: Sequelize.STRING,
      allownull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Invite;
