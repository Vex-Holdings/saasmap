const express = require('express')
const { sequelize, Sequelize } = require('../models')
const router = express.Router()
const getAllUsers = require('../middlewares/getallusers')
const models = require('../models')

// GET Pages

router.get('/add-insto', async (req,res) => {
    let org = await models.Organization.findAll({
        order:
            ['orgname']
    })
    res.render('users/add-insto', {org: org})
})

router.get('/organization/:orgId', async (req,res) => {
    let orgid = req.params.orgId
    let organization = await models.Organization.findByPk(orgid)
    let sector = await models.Sector.findAll({
        where: {
            orgid: orgid
        }
    })
    let staff = await sequelize.query('SELECT r.position, p.id, p.firstname, p.lastname FROM "Roles" r JOIN "People" p ON r.peopleid = p.id WHERE r.role = \'staff\' AND r.orgid = ' + orgid, {type: Sequelize.QueryTypes.SELECT})
    let investor = await sequelize.query('SELECT r.position, p.id, p.firstname, p.lastname FROM "Roles" r JOIN "People" p ON r.peopleid = p.id WHERE r.role = \'investor\' AND r.orgid = ' + orgid, {type: Sequelize.QueryTypes.SELECT})
    let vc = await sequelize.query('SELECT o.id, o.orgname, i.roundtype FROM "Instos" i JOIN "Organizations" o ON i.investorid = o.id WHERE i.investeeid = ' + orgid, {type: Sequelize.QueryTypes.SELECT})
    let investment = await sequelize.query('SELECT o.id, o.orgname, i.roundtype FROM "Instos" i JOIN "Organizations" o ON i.investeeid = o.id WHERE i.investorid = ' + orgid, {type: Sequelize.QueryTypes.SELECT})
    let advisor = await sequelize.query('SELECT r.position, p.id, p.firstname, p.lastname FROM "Roles" r JOIN "People" p ON r.peopleid = p.id WHERE r.role = \'advisor\' AND r.orgid = ' + orgid, {type: Sequelize.QueryTypes.SELECT})
    res.render('users/organization', {organization: organization, sector: sector, staff: staff, investor: investor, vc: vc, investment: investment, advisor: advisor})
})

router.get('/person/:peopleId', async (req,res) => {
    let personid = req.params.peopleId
    let person = await models.People.findByPk(personid)
    let role = await sequelize.query('SELECT r.role, o.id, o.orgname, r.position FROM "Roles" r JOIN "Organizations" o ON r.orgid = o.id WHERE r.peopleid = ' + personid, {type: Sequelize.QueryTypes.SELECT})
    
    let org = await models.Organization.findAll({
        order:
            ['orgname']
    })

    let comment = await models.Comment.findAll({
        where: {
            peopleid: personid
        }
    })

    res.render('users/person', {person: person, role: role, org: org, comment: comment})
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

router.post('/delete-peepcomment',async (req,res) => {
    let commentid = parseInt(req.body.commentid)
    let peopleid = parseInt(req.body.peopleid)
    let result = await models.Comment.destroy({
        where: {
            id: commentid
        }
    })
    res.redirect('/users/person/' + peopleid)
})

router.post('/add-peepcomment', async (req,res) => {
    const title = req.body.title
    const body = req.body.body
    const peopleid = parseInt(req.body.peopleid)
    // const orgid = parseInt(req.body.orgid)
    const userid = req.session.user.userId

    const newcomment = await models.Comment.build({
        title: title,
        body: body,
        userid: userid,
        peopleid: peopleid,
        // orgid: orgid
    })
    let savedComment = await newcomment.save()
    if (savedComment != null) {
        res.redirect('/users/person/' + peopleid)
    }
})

router.post('/add-insto', async (req,res) => {
    const investor = parseInt(req.body.investorid)
    const investee = parseInt(req.body.investeeid)
    const roundtype = req.body.roundtype

    const newinsto = await models.Insto.build({
        investorid: investor,
        investeeid: investee,
        roundtype: roundtype
    })
    let savedInsto = await newinsto.save()
    if(savedInsto != null) {
        res.redirect('/users/organization/' + investor)
    } else {
        res.render('users/add-insto', {message: 'Error adding institutional investor relationship'})
    }
})

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
        res.render('users/add-sector', {message: 'Error adding sector'})
    }
})

router.post('/add-role', async (req,res) => {
    const role = req.body.role
    const peopleid = parseInt(req.body.peopleid)
    const orgid = parseInt(req.body.orgid)
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
        res.render('/users/add-role', {message: 'Error adding role'})
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