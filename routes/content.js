const express = require('express');
const router = express.Router();
const { Content } = require('../db/models');
// const IModule = Content.belongsTo(Module, {as: 'moduleData'});
const { auth } = require('../middleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/contents')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('file')

router.get('/', [auth.isAuthenticated], (req, res) => {
    Content.findAll({
        order: [
            ['order', 'ASC']
        ],
    })
        .then(contents => {
            res.send({ contents });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
})

router.get('/:id', [auth.isAuthenticated], (req, res) => {
    Content.findByPk(req.params.id)
        .then(content => {
            res.send({ content });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
})

router.get('/module/:id', [auth.isAuthenticated], (req, res) => {
    Content.findAll({
        where: {
            module: req.params.id
        }
    })
        .then(contents => {
            res.send({ contents });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
})

router.post('/add', [auth.isAuthenticated], (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        if (!req.body.title) {
            res.status(400).send({
                message: "Title can not be empty!"
            });
            return;
        }
        const title = req.body.title || '';
        const module = req.body.module || '';
        // const text = req.body.text || '';
        const videolink = req.body.videolink || '';
        const comment = req.body.comment || false;
        const file = req.file ? req.file.path : '';

        Content.max('order').then(max => {
            const contentData = {
                title: title,
                module: module,
                videolink: videolink,
                comment: comment,
                file: file,
                order: isNaN(max) ? 0 : max + 1,
            };
            Content.create(contentData)
                .then(data => {
                    res.send({ success: 'success' });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred"
                    });
                });
        })
    })
})

router.post('/edit/:id', [auth.isAuthenticated], (req, res, next) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        if (!req.body.title) {
            res.status(400).send({
                message: "Title can not be empty!"
            });
            return;
        }
        let contentData = {}
        if (req.file) {
            contentData = {
                title: req.body.title,
                // text: req.body.text,
                videolink: req.body.videolink,
                comment: req.body.comment,
                file: req.file ? req.file.path : '',
                order: req.body.order
            };
        } else {
            contentData = {
                title: req.body.title,
                // text: req.body.text,
                videolink: req.body.videolink,
                comment: req.body.comment,
                order: req.body.order
            };
        }
        Content.update(contentData, {
            where: {
                id: req.params.id
            }
        })
            .then(() => res.status(200).json({ success: 'success' }))
            .catch(err => next(err));
    })
})

router.post('/edit', [auth.isAuthenticated], async (req, res, next) => {
    const updatePromises = req.body.contents.map(item => {
        return Content.update({ order: item.order }, {
            where: {
                id: item.id
            }
        })
            .then(() => {
                return Content.findOne({
                    where: {
                        id: item.id
                    }
                })
            })
            .catch(err => next(err));
    });
    Promise.all(updatePromises).then(contents => {
        contents.sort(GetSortOrder('order'));
        res.json({ contents })
    })
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
    }
}

router.get('/mark/:id', [auth.isAuthenticated], (req, res) => {

    Content.update({ status: "read" }, {
        where: { id: req.params.id }
    })
        .then(() => {
            res.json({ success: 'success' });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "DB error"
            });
        });
})

router.delete('/delete/:id', [auth.isAuthenticated], (req, res) => {
    Content.destroy({
        where: { id: req.params.id },
        truncate: false
    })
        .then(nums => {
            res.json({ success: 'success' });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "DB error"
            });
        });
})


module.exports = router;