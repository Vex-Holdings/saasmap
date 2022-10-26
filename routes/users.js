const express = require('express')
const { sequelize, Sequelize } = require('../models')
const router = express.Router()
const getAllUsers = require('../middlewares/getallusers')
const models = require('../models')

// GET Pages

router.get('/admin', async (req,res) => {
    const orgs = await models.Organization.findAll()
    const people = await models.People.findAll()
    res.render('users/admin', {orgs: orgs, people: people})
})

router.get('/add-person', async (req, res) => {
    const users = await models.User.findAll()
    res.render('users/add-person', {users: users})
})

router.get('/add-organization', (req, res) => {
    res.render('users/add-organization')
})

// POST Pages

router.post('/add-organization', async (req,res) => {
    const orgname = req.body.orgname
    const description = req.body.description
    const location = req.body.location
    const website = req.body.website

    const neworg = await models.Organization.build({
        orgname: orgname,
        description: description,
        location: location,
        website: website
    })
    let savedOrg = await neworg.save()
    if(savedOrg != null) {
        res.redirect('/users/admin')
    } else {
        res.render('users/add-organization',{message: 'Error adding new organization to the database'})
    }
})

router.post('/add-person', async (req,res) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const location = req.body.location
    const linkedin = req.body.linkedin
    const twitter = req.body.twitter
    const email = req.body.email
    const source = req.body.source
    const userid = req.session.user.userId

    const newperson = await models.People.build({
        firstname: firstname,
        lastname: lastname,
        location: location,
        linkedin: linkedin,
        twitter: twitter,
        email: email,
        source: source,
        userid: userid
    })
    let savedPerson = await newperson.save()
    if(savedPerson != null) {
        res.redirect('/users/admin')
    } else {
        res.render('users/add-person',{message: 'Error adding new person to the database'})
    }
})

module.exports = router;