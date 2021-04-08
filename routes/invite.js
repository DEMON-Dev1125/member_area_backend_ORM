const express = require("express");
const router = express.Router();

const { Invite } = require("../db/models");
const { auth } = require("../middleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/invites");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

router.get("/", [auth.isAuthenticated], (req, res) => {
  Invite.findAll({})
    .then((data) => {
      res.send({ invites: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.get("/:id", [auth.isAuthenticated], (req, res) => {
  Invite.findByPk(req.params.id)
    .then((data) => {
      res.send({ invite: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.post("/add", [auth.isAuthenticated], (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    if (!req.body.title) {
      res.status(400).send({
        message: "Title can not be empty!",
      });
      return;
    }
    const title = req.body.title || "";
    const description = req.body.description || "";
    const file = req.file ? req.file.path : "";
    const invite = {
      title: title,
      description: description,
      file: file,
    };
    // Save Certificatie in the database
    Invite.create(invite)
      .then((data) => {
        res.send({ success: "success" });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred",
        });
      });
  });
});

router.post("/edit/:id", [auth.isAuthenticated], (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    if (!req.body.title) {
      res.status(400).send({
        message: "Title can not be empty!",
      });
      return;
    }
    const title = req.body.title || "";
    const description = req.body.description || "";
    const file = req.file ? req.file.path : "";
    const invite = {
      title: title,
      description: description,
      file: file,
    };
    Invite.update(invite, {
      where: {
        id: req.params.id,
      },
    })
      .then(() => res.status(200).json({ success: "success" }))
      .catch((err) => next(err));
  });
});

router.delete("/delete/:id", [auth.isAuthenticated], (req, res) => {
  Invite.destroy({
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
