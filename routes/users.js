const express = require('express')
const { sequelize, Sequelize } = require('../models')
const router = express.Router()
const models = require('../models')

// GET Pages

router.get('/admin', async (req,res) => {
    res.render('users/admin')
})


// POST Pages


module.exports = router;