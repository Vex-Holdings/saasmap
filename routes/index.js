const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const models = require('../models');

const SALT_ROUNDS = 10;

// GET pages 
router.get('/',(req,res) => {
    res.render('start')
})

router.get('/register',(req,res) => {
    res.render('register')
})

router.get('/login',(req,res) => {
    res.render('login')
})

// POST pages
router.post('/',(req,res) => {

})
module.exports = router;