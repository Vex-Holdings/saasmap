const express = require('express')
const { sequelize, Sequelize } = require('../models')
const router = express.Router()
const getAllUsers = require('../middlewares/getallusers')
const models = require('../models')

// GET Pages

router.get('/admin', (req,res) => {
    res.render('users/admin')
})


// POST Pages


module.exports = router;