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

router.get('/logout',(req,res,next) => {

    if(req.session) {
        req.session.destroy((error) => {
            if(error) {
                next(error)
            } else {
                res.redirect('/login')
            }
        })
    }
})

// POST pages
router.post('/login', async (req,res) => {
    let username = req.body.username
    let password = req.body.password

    let user = await models.User.findOne({
        where: {
            username: username
        }
    })
    if(user != null) {
        bcrypt.compare(password, user.password,(error, result) => {
            if(result) {
                // create a session
                if(req.session) {
                    req.session.user = {userId: user.id}
                    res.redirect('/users/admin')
                }
            } else {
                res.render('login',{message: 'Incorrect username or password'})
            }
        })
    } else { // if the user is null
        res.render('login',{message: 'Incorrect username or password'})
    }
})

router.post('/register', async (req,res) => {
    let username = req.body.username
    let password = req.body.password
    let status = req.body.status
    
    let persistedUser = await models.User.findOne({
        where: {
            username: username
        }
    })

    if(persistedUser == null) {

        bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
            if(error) {
                res.render('register',{message: 'Error creating user!'})
            } else {
                let user = models.User.build({
                    username: username,
                    password: hash,
                    status: status
                })

                let savedUser = await user.save()
                if(savedUser != null) {
                    res.redirect('login')
                } else {
                    res.render('register',{message: 'User already exists!'})
                }
            }
        })
    } else {
        res.render('register',{message: 'User already exists!'})
    }
})
module.exports = router;