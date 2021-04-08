const Sequelize = require("sequelize");
const db = require("../db");

const Course = db.define(
  "course",
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allownull: false,
    },
    acronym: {
      type: Sequelize.STRING,
      allownull: false,
    },
    pageURL: {
      type: Sequelize.STRING,
      allownull: true,
    },
    description: {
      type: Sequelize.STRING,
      allownull: true,
    },
    commentModeration: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Course;
