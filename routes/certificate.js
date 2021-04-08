const express = require("express");
const router = express.Router();

const { Certificate } = require("../db/models");
const { auth } = require("../middleware");

router.get("/", [auth.isAuthenticated], (req, res) => {
  Certificate.findAll({})
    .then((data) => {
      res.send({ certificates: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.get("/:id", [auth.isAuthenticated], (req, res) => {
  Certificate.findByPk(req.params.id)
    .then((data) => {
      res.send({ certificate: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.post("/add", [auth.isAuthenticated], (req, res) => {
  if (!req.body.contentDetail) {
    res.status(400).send({
      message: "Content Detail can not be empty!",
    });
    return;
  }
  const contentDetail = req.body.contentDetail || "";
  const certificate = {
    contentDetail: contentDetail,
  };
  // Save Certificatie in the database
  Certificate.create(certificate)
    .then((data) => {
      res.send({ success: "success" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

router.post("/edit/:id", [auth.isAuthenticated], (req, res, next) => {
  Certificate.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.status(200).json({ success: "success" }))
    .catch((err) => next(err));
});

router.delete("/delete/:id", [auth.isAuthenticated], (req, res) => {
  Certificate.destroy({
    where: { id: req.params.id },
    truncate: false,
  })
    .then((nums) => {
      res.json({ success: "success" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "DB error",
      });
    });
});

module.exports = router;
