const express = require("express");
const router = express.Router();

const { Module } = require("../db/models");
const { auth } = require("../middleware");

router.get("/", [auth.isAuthenticated], (req, res) => {
  Module.findAll({
    order: [["order", "ASC"]],
  })
    .then((modules) => {
      res.send({ modules });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.get("/:id", [auth.isAuthenticated], (req, res) => {
  Module.findByPk(req.params.id)
    .then((module) => {
      res.send({ module });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.post("/add", [auth.isAuthenticated], (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }
  const name = req.body.name || "";
  Module.max("order").then((max) => {
    const moduleData = {
      name: name,
      order: isNaN(max) ? 0 : max + 1,
    };
    Module.create(moduleData)
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
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }
  const moduleData = {
    name: req.body.name,
    order: req.body.order,
  };
  Module.update(moduleData, {
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.status(200).json({ success: "success" }))
    .catch((err) => next(err));
});

router.post("/edit", [auth.isAuthenticated], async (req, res, next) => {
  const updatePromises = req.body.modules.map((item) => {
    return Module.update(
      { order: item.order },
      {
        where: {
          id: item.id,
        },
      }
    )
      .then(() => {
        return Module.findOne({
          where: {
            id: item.id,
          },
        });
      })
      .catch((err) => next(err));
  });
  Promise.all(updatePromises).then((modules) => {
    modules.sort(GetSortOrder("order"));
    res.json({ modules });
  });
});

//Comparer Function
const GetSortOrder = (prop) => {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
};
router.delete("/delete/:id", [auth.isAuthenticated], (req, res) => {
  Module.destroy({
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
