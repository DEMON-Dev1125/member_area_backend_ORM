const express = require('express');
const router = express.Router();

const { Group, Classmodule } = require('../db/models');
const { auth } = require('../middleware');

router.get('/', [auth.isAuthenticated], (req, res) => {
    Group.findAll()
        .then(groups => {
            const createPromises = groups.map(group => {
                return Classmodule.findAll({
                    where: {
                        group_id: group.id
                    },
                }).then(data => {
                    group.dataValues.moduleData = data;
                    return group;
                })
            })
            Promise.all(createPromises).then((groups) => {
                res.status(200).send({ groups })
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "DB error"
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
})

router.get('/:id', [auth.isAuthenticated], (req, res) => {
    Group.findByPk(req.params.id)
        .then(group => {
            Classmodule.findAll({
                where: {
                    group_id: group.id
                },
            }).then(data => {
                group.dataValues.moduleData = data;
                res.send({ group });
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "DB error"
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
})

router.post('/add', [auth.isAuthenticated], (req, res) => {

    if (!req.body.name) {
        res.status(400).send({
            message: "Name can not be empty!"
        });
        return;
    }
    const name = req.body.name || '';
    const accessterm = req.body.accessterm || 0;
    const standardclass = req.body.standardclass || false;
    const moduleData = req.body.moduleData || [];
    const groupData = {
        name: name,
        accessterm: accessterm,
        standardclass: standardclass,
    };
    Group.create(groupData)
        .then(group => {
            const createPromises = moduleData.map(item => {
                Classmodule.create({
                    group_id: group.id,
                    module_id: item.module_id,
                    type: item.type,
                    fromdate: item.fromdate ? item.fromdate : Date.now(),
                    todate: item.todate ? item.todate : Date.now(),
                    daysafter: item.daysafter ? item.daysafter : 0,
                })
            })
            Promise.all(createPromises).then(() => {
                res.status(200).json({ success: 'success' })
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "DB error"
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred"
            });
        });
})

router.post('/edit/:id', [auth.isAuthenticated], (req, res, next) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Name can not be empty!"
        });
        return;
    }
    const name = req.body.name || '';
    const accessterm = req.body.accessterm || 0;
    const standardclass = req.body.standardclass || false;
    const moduleData = req.body.moduleData || [];
    const groupData = {
        name: name,
        accessterm: accessterm,
        standardclass: standardclass,
    };
    Group.update(groupData, {
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            const updatePromises = moduleData.map(item => {
                Classmodule.findAll({
                    where: {
                        group_id: req.params.id,
                        module_id: item.module_id
                    }
                }).then(result => {
                    if (result.length == 0) {
                        return Classmodule.create({
                            group_id: req.params.id,
                            module_id: item.module_id,
                            type: item.type,
                            fromdate: item.fromdate ? item.fromdate : Date.now(),
                            todate: item.todate ? item.todate : Date.now(),
                            daysafter: item.daysafter ? item.daysafter : 0,
                        }
                        ).then((data) => {
                            return "success";
                        }).catch(err => {
                            return err
                        });
                    }
                    else if (result.length == 1) {
                        return Classmodule.update({
                            type: item.type,
                            fromdate: item.fromdate ? item.fromdate : Date.now(),
                            todate: item.todate ? item.todate : Date.now(),
                            daysafter: item.daysafter ? item.daysafter : 0,
                        },
                            {
                                where: {
                                    group_id: req.params.id,
                                    module_id: item.module_id
                                }
                            }
                        ).then(() => {
                            return "success";
                        }).catch(err => {
                            return err
                        });
                    }
                })

            })
            Promise.all(updatePromises).then(() => {
                res.status(200).json({ success: 'success' })
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "DB error"
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred"
            });
        });
})

router.delete('/delete/:id', [auth.isAuthenticated], (req, res) => {
    Group.destroy({
        where: { id: req.params.id },
        truncate: false
    })
        .then(() => {
            Classmodule.destroy({
                where: { group_id: req.params.id },
                truncate: false
            })
                .then(() => { res.json({ success: 'success' }); })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "DB error"
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "DB error"
            });
        });
})


module.exports = router;