const express = require("express");
const router = express.Router();

const { Course } = require("../db/models");
const { auth } = require("../middleware");

router.get("/", [auth.isAuthenticated], (req, res) => {
  Course.findAll({})
    .then((courses) => {
      res.send({ courses });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.get("/:id", [auth.isAuthenticated], (req, res) => {
  Course.findByPk(req.params.id)
    .then((course) => {
      res.send({ course });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
});

router.post("/add", [auth.isAuthenticated], (req, res) => {
  // if (!req.body.name) {
  //     res.status(400).send({
  //         message: "Name can not be empty!"
  //     });
  //     return;
  // }
  // const name = req.body.name || '';
  // Course.max('order').then(max => {
  //     const courseData = {
  //         name: name,
  //         order: isNaN(max) ? 0 : max + 1,
  //     };
  //     Course.create(courseData)
  //         .then(data => {
  //             res.send({ success: 'success' });
  //         })
  //         .catch(err => {
  //             res.status(500).send({
  //                 message:
  //                     err.message || "Some error occurred"
  //             });
  //         });
  // })
});

router.post("/edit/:id", [auth.isAuthenticated], (req, res, next) => {
  // if (!req.body.name) {
  //     res.status(400).send({
  //         message: "Name can not be empty!"
  //     });
  //     return;
  // }
  // const courseData = {
  //     name: req.body.name,
  //     order: req.body.order
  // };
  // Course.update(courseData, {
  //     where: {
  //         id: req.params.id
  //     }
  // })
  //     .then(() => res.status(200).json({ success: 'success' }))
  //     .catch(err => next(err));
});

// router.post('/edit', [auth.isAuthenticated], async (req, res, next) => {
//     const updatePromises = req.body.courses.map(item => {
//         return Course.update({ order: item.order }, {
//             where: {
//                 id: item.id
//             }
//         })
//             .then(() => {
//                 return Course.findOne({
//                     where: {
//                         id: item.id
//                     }
//                 })
//             })
//             .catch(err => next(err));
//     });
//     Promise.all(updatePromises).then(courses => {
//         courses.sort(GetSortOrder('order'));
//         res.json({ courses })
//     })
// });

//Comparer Function
// const GetSortOrder = (prop) => {
//     return function (a, b) {
//         if (a[prop] > b[prop]) {
//             return 1;
//         } else if (a[prop] < b[prop]) {
//             return -1;
//         }
//         return 0;
//     }
// }
router.delete("/delete/:id", [auth.isAuthenticated], (req, res) => {
  Course.destroy({
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
