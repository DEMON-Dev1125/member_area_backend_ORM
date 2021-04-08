const Sequelize = require("sequelize");
const db = require("../db");

const Appearance = db.define(
  "appearance",
  {
    color1: {
      type: Sequelize.STRING,
      unique: true,
      allownull: false,
    },
    color2: {
      type: Sequelize.STRING,
      allownull: false,
    },
    navimg: {
      type: Sequelize.STRING,
      allownull: false,
    },
    favicon: {
      type: Sequelize.STRING,
      allownull: false,
    },
    loginimg: {
      type: Sequelize.STRING,
      allownull: false,
    },
    loginbackground: {
      type: Sequelize.STRING,
      allownull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Appearance;
