const express = require('express')
const { sequelize, Sequelize } = require('../models')
const router = express.Router()
const getAllUsers = require('../middlewares/getallusers')
const models = require('../models')

// GET Pages

router.get('/organization/:orgId', async (req,res) => {
    let orgid = req.params.orgId
    let organization = await models.Organization.findByPk(orgid)
    let sector = await models.Sector.findAll({
        where: {
            orgid: orgid
        }
    })
    res.render('users/organization', {organization: organization, sector: sector})
})

router.get('/person/:peopleId', async (req,res) => {
    let personid = req.params.peopleId
    let person = await models.People.findByPk(personid)
    let role = await sequelize.query('SELECT r.role, o.orgname, r.position FROM "Roles" r JOIN "Organizations" o ON r.orgid = o.id WHERE r.peopleid = ' + personid, {type: Sequelize.QueryTypes.SELECT})
    /*
    let role = await models.Role.findAll({
        where: {
            peopleid: personid
        }
    })
    */
    let org = await models.Organization.findAll({
        order:
            ['orgname']
    })
    res.render('users/person', {person: person, role: role, org: org})
})

router.get('/admin', async (req,res) => {
    const orgs = await models.Organization.findAll({
        order:
            ['orgname']
    })
    const people = await models.People.findAll({
        order: 
            ['lastname']
    })
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

router.post('/add-sector', async (req,res) => {
    const sectorname = req.body.sectorname
    const orgid = parseInt(req.body.orgid)

    const newsector = await models.Sector.build({
        sectorname: sectorname,
        orgid: orgid
    })
    let savedSector = await newsector.save()
    if(savedSector != null) {
        res.redirect('/users/organization/' + orgid)
    } else {
        res.redirect('/users/organization/' + orgid, {message: 'Error adding sector'})
    }
})

router.post('/add-role', async (req,res) => {
    const role = req.body.role
    const peopleid = parseInt(req.body.peopleid)
    const orgid = req.body.orgid
    const position = req.body.position

    const newrole = await models.Role.build({
        role: role,
        peopleid: peopleid,
        orgid: orgid,
        position: position
    })
    let savedRole = await newrole.save()
    if(savedRole != null) {
        res.redirect('/users/person/' + peopleid)
    } else {
        res.redirect('/users/person/' + peopleid, {message: 'Error adding role'})
    }
})

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