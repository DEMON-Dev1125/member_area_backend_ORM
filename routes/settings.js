const express = require("express");
const router = express.Router();

const { Setting } = require("../db/models");
const { auth } = require("../middleware");

router.get("/", [auth.isAuthenticated], (req, res) => {
  Setting.findAll({ limit: 1 })
    .then((data) => {
      res.send({ settings: data });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});

router.post("/edit", [auth.isAuthenticated], (req, res) => {
  if (!req.body.memberareaname) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const memberareaname = req.body.memberareaname || "";
  const contactemail = req.body.contactemail || "";
  const domain = req.body.domain || "";
  const lang = req.body.lang || "";
  const timezone = req.body.timezone || "";
  const emailsubject = req.body.emailsubject || "";
  const message = req.body.message || "";

  Setting.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      const setting = {
        memberareaname: memberareaname,
        contactemail: contactemail,
        domain: domain,
        lang: lang,
        timezone: timezone,
        emailsubject: emailsubject,
        message: message,
      };

      // Save Setting in the database
      Setting.create(setting)
        .then((data) => {
          const arr = [];
          arr.push(data);
          res.send({ settings: arr });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while setting",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "DB error",
      });
    });
});

module.exports = router;
