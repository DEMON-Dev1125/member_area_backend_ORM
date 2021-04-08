const express = require("express");
const router = express.Router();

const config = require("../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { User } = require("../db/models");
const { verifySignUp } = require("../middleware");

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  (req, res) => {
    User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })
      .then((user) => {
        res.json({ success: "success" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
);

router.post("/signin", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          token: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({ token, success: "success" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
module.exports = router;
