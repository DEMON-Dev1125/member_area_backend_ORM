const Sequelize = require("sequelize");
const db = require("../db");

const Content = db.define(
  "content",
  {
    title: {
      type: Sequelize.STRING,
      unique: true,
      allownull: false,
    },
    module: {
      type: Sequelize.INTEGER,
      allownull: false,
    },
    text: {
      type: Sequelize.STRING,
      allownull: true,
    },
    videolink: {
      type: Sequelize.STRING,
      allownull: true,
    },
    status: {
      type: Sequelize.STRING,
      allownull: false,
      default: "unread",
    },
    file: {
      type: Sequelize.STRING,
      allownull: true,
    },
    comment: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    order: {
      type: Sequelize.INTEGER,
      allownull: false,
      default: -1,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Content;
