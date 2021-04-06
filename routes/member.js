const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var bcrypt = require("bcryptjs");

const { User } = require('../db/models');
const { auth } = require('../middleware');

router.get('/', [auth.isAuthenticated], (req, res) => {
    User.findAll({})
        .then(members => {
            res.send({ members });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
})

router.post('/filter', [auth.isAuthenticated], (req, res) => {
    let query ={};
    const count =  req.body.count || 10;
    const pageNum =  req.body.pageNum || 0;
    const membertype =  req.body.membertype;
    const blocked =  req.body.blocked;
    const group =  req.body.group;
    const name =  req.body.name;
    if(blocked){
        query = {
            blocked: true,
        }
    }
    else {
        query ={
            membertype: membertype
        }
    }
    if(name){
        query.name = {
            [Op.like]: '%'+name+'%'
          }
    }
    if(group){
        query.group = group
    }
    console.log(query);
    User.findAndCountAll({
        where: query,
        offset: (pageNum-1)*count,
        limit: count
     })
        .then(result => {
            res.send({ members: result.rows, total: result.count });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
})

router.get('/:id', [auth.isAuthenticated], (req, res) => {
    User.findByPk(req.params.id)
        .then(member => {
            res.send({ member });
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
    const email = req.body.email || '';
    const membertype = req.body.membertype || '';
    const group = req.body.group || -1;
    // const password = req.body.password || "";
    // const blocked = req.body.blocked || false;

    const memberData = {
        name: name,
        email: email,
        membertype: membertype,
        group: group,
        // password: password,
        // blocked: blocked,
    };
    User.create(memberData)
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

router.post('/edit/:id', [auth.isAuthenticated], (req, res, next) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Name can not be empty!"
        });
        return;
    }
    const name = req.body.name || '';
    const email = req.body.email || '';
    const membertype = req.body.membertype || '';
    const group = req.body.group || -1;
    const password = req.body.password || "";
    const blocked = req.body.blocked || false;
    const memberData = {
        name: name,
        email: email,
        membertype: membertype,
        group: group,
        password: bcrypt.hashSync(password, 8),
        blocked: blocked,
    };
    User.update(memberData, {
        where: {
            id: req.params.id
        }
    })
        .then(() => res.status(200).json({ success: 'success' }))
        .catch(err => next(err));
})

router.delete('/delete/:id', [auth.isAuthenticated], (req, res) => {
    User.destroy({
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