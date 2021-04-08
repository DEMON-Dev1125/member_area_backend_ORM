const express = require("express");
const router = express.Router();

const { Appearance } = require("../db/models");
const { auth } = require("../middleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/appearance");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "navimg", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "loginimg", maxCount: 1 },
  { name: "loginbackground", maxCount: 1 },
]);

router.get("/", [auth.isAuthenticated], (req, res) => {
  Appearance.findAll({ limit: 1 })
    .then((data) => {
      res.send({ appearance: data });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});

router.post("/edit", [auth.isAuthenticated], (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    const color1 = req.body.color1 || "#ddd";
    const color2 = req.body.color2 || "#fff";
    const navimg = req.files.navimg ? req.files.navimg[0].path : "";
    const favicon = req.files.favicon ? req.files.favicon[0].path : "";
    const loginimg = req.files.loginimg ? req.files.loginimg[0].path : "";
    const loginbackground = req.files.loginbackground
      ? req.files.loginbackground[0].path
      : "";
    let updateData = {
      color1: color1,
      color2: color2,
    };
    if (navimg) {
      updateData.navimg = navimg;
    }
    if (favicon) {
      updateData.favicon = favicon;
    }
    if (loginimg) {
      updateData.loginimg = loginimg;
    }
    if (loginbackground) {
      updateData.loginbackground = loginbackground;
    }
    Appearance.max("id").then((max) => {
      console.log(max);
      if (isNaN(max)) {
        Appearance.create(updateData)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "DB error",
            });
          });
      } else {
        Appearance.update(updateData, { where: { id: max } })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "DB error",
            });
          });
      }
    });
  });
});

module.exports = router;
