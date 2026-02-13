const express = require('express')
const { sequelize, Sequelize } = require('../models')
const router = express.Router()
const getAllUsers = require('../middlewares/getallusers')
const models = require('../models')

// GET Pages

router.get('/ai', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'AI\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/ai', {companies: companies})
})

router.get('/acquired', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Acquired\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/acquired', {companies: companies})
})

router.get('/analytics', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Analytics\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/analytics', {companies: companies})
})

router.get('/autonomousvehicles', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Autonomous Vehicles\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/autonomousvehicles', {companies: companies})
})

router.get('/biotech', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Biotech\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/biotech', {companies: companies})
})

router.get('/cancer', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Cancer\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/cancer', {companies: companies})
})

router.get('/cloud', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Cloud\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/cloud', {companies: companies})
})

router.get('/consumerelectronics', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Consumer Electronics\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/consumerelectronics', {companies: companies})
})

router.get('/crypto', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Crypto\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/crypto', {companies: companies})
})

router.get('/cryptocurrency', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Cryptocurrency\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/cryptocurrency', {companies: companies})
})

router.get('/cybernetics', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Cybernetics\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/cybernetics', {companies: companies})
})

router.get('/data', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Data\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/data', {companies: companies})
})

router.get('/defense', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Defense\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/defense', {companies: companies})
})

router.get('/energy', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Energy\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/energy', {companies: companies})
})

router.get('/fintech', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Fintech\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/fintech', {companies: companies})
})

router.get('/financialservices', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Financial Services\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/financialservices', {companies: companies})
})

router.get('/firmware', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Firmware\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/firmware', {companies: companies})
})

router.get('/foodtech', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'FoodTech\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/foodtech', {companies: companies})
})

router.get('/healthcare', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Health Care\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/healthcare', {companies: companies})
})

router.get('/logistics', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Logistics\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/logistics', {companies: companies})
})

router.get('/machinelearning', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Machine Learning\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/machinelearning', {companies: companies})
})

router.get('/medicaldevice', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Medical Device\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/medicaldevice', {companies: companies})
})

router.get('/messaging', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Messaging\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/messaging', {companies: companies})
})

router.get('/mobile', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Mobile\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/mobile', {companies: companies})
})

router.get('/nft', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'NFT\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/nft', {companies: companies})
})

router.get('/networking', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Networking\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/networking', {companies: companies})
})

router.get('/onlinegaming', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Online Gaming\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/onlinegaming', {companies: companies})
})

router.get('/onlineportals', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Online Portals\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/onlineportals', {companies: companies})
})

router.get('/python', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Python\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/python', {companies: companies})
})

router.get('/realestate', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Real Estate\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/realestate', {companies: companies})
})

router.get('/renewableenergy', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Renewable Energy\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/renewableenergy', {companies: companies})
})

router.get('/ridehailing', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Ride Hailing\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/ridehailing', {companies: companies})
})

router.get('/robotics', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Robotics\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/robotics', {companies: companies})
})

router.get('/saas', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'SaaS\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/saas', {companies: companies})
})

router.get('/securefilemanagement', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Secure File Management\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/securefilemanagement', {companies: companies})
})

router.get('/security', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Security\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/security', {companies: companies})
})

router.get('/socialmedia', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Social Media\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/socialmedia', {companies: companies})
})

router.get('/vex', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Vex\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/vex', {companies: companies})
})

router.get('/videogames', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Video Games\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/videogames', {companies: companies})
})

router.get('/insurance', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Insurance\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/insurance', {companies: companies})
})

router.get('/voip', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'VOIP\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/voip', {companies: companies})
})

router.get('/a16z', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'a16z SaaS\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/a16z', {companies: companies})
})

router.get('/greylock', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Greylock SaaS\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/greylock', {companies: companies})
})

router.get('/dfj', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'DFJ SaaS\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/dfj', {companies: companies})
})

router.get('/sequoia', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Sequoia SaaS\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/sequoia', {companies: companies})
})

router.get('/turtle', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Turtle\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/turtle', {companies: companies})
})

router.get('/forge', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Forge\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/forge', {companies: companies})
})

router.get('/bayarea', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Bay Area Series A\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/bayarea', {companies: companies})
})

router.get('/vc', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Venture Capital\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/vc', {companies: companies})
})

router.get('/bavcpe', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Venture Capital\' AND o.location LIKE \'%, CA\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/bavcpe', {companies: companies})
})

router.get('/sfvcpe', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Venture Capital\' AND o.location = \'San Francisco, CA\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/sfvcpe', {companies: companies})
})

router.get('/bitcoin', async (req,res) => {
    let companies = await sequelize.query('SELECT o.id, o.orgname, o.description, o.location FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Bitcoin\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})

    res.render('users/bitcoin', {companies: companies})
})

router.get('/add-insto', async (req,res) => {
    let org = await models.Organization.findAll({
        order:
            ['orgname']
    })
    let vc = await sequelize.query('SELECT o.id, o.orgname FROM "Organizations" o JOIN "Sectors" s ON s.orgid = o.id WHERE s.sectorname = \'Venture Capital\' ORDER BY o.orgname', {type: Sequelize.QueryTypes.SELECT})
    res.render('users/add-insto', {org: org, vc: vc})
})

router.get('/organization/:orgId', async (req,res) => {
    let orgid = req.params.orgId
    let organization = await models.Organization.findAll({
        where: {
            id: orgid
        }
    })
    let sector = await models.Sector.findAll({
        where: {
            orgid: orgid
        }
    })
    let staff = await sequelize.query('SELECT r.position, p.id, p.firstname, p.lastname FROM "Roles" r JOIN "People" p ON r.peopleid = p.id WHERE r.role = \'staff\' AND r.orgid = $orgid', {bind: {orgid}, type: Sequelize.QueryTypes.SELECT})
    let investor = await sequelize.query('SELECT r.position, p.id, p.firstname, p.lastname FROM "Roles" r JOIN "People" p ON r.peopleid = p.id WHERE r.role = \'investor\' AND r.orgid = $orgid', {bind: {orgid}, type: Sequelize.QueryTypes.SELECT})
    let vc = await sequelize.query('SELECT o.id, o.orgname, i.roundtype FROM "Instos" i JOIN "Organizations" o ON i.investorid = o.id WHERE i.investeeid = $orgid', {bind: {orgid}, type: Sequelize.QueryTypes.SELECT})
    let investment = await sequelize.query('SELECT o.id, o.orgname, i.roundtype FROM "Instos" i JOIN "Organizations" o ON i.investeeid = o.id WHERE i.investorid = $orgid', {bind: {orgid}, type: Sequelize.QueryTypes.SELECT})
    let advisor = await sequelize.query('SELECT r.position, p.id, p.firstname, p.lastname FROM "Roles" r JOIN "People" p ON r.peopleid = p.id WHERE r.role = \'advisor\' AND r.orgid = $orgid', {bind: {orgid}, type: Sequelize.QueryTypes.SELECT})
    let comment = await models.Comment.findAll({
        where: {
            orgid: orgid
        }
    })

    res.render('users/organization', {organization: organization, sector: sector, staff: staff, investor: investor, vc: vc, investment: investment, advisor: advisor, comment: comment})
})

router.get('/person/:peopleId', async (req,res) => {
    let personid = req.params.peopleId
    let person = await models.People.findByPk(personid)
    let role = await sequelize.query('SELECT r.role, o.id, o.orgname, r.position FROM "Roles" r JOIN "Organizations" o ON r.orgid = o.id WHERE r.peopleid = $personid', {bind: {personid}, type: Sequelize.QueryTypes.SELECT})
    
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

router.post('/delete-orgcomment',async (req,res) => {
    let commentid = parseInt(req.body.commentid)
    let orgid = parseInt(req.body.orgid)
    let result = await models.Comment.destroy({
        where: {
            id: commentid
        }
    })
    res.redirect('/users/organization/' + orgid)
})

router.post('/add-orgcomment', async (req,res) => {
    const title = req.body.title
    const body = req.body.body
    // const peopleid = parseInt(req.body.peopleid)
    const orgid = parseInt(req.body.orgid)
    const userid = req.session.user.userId

    const newcomment = await models.Comment.build({
        title: title,
        body: body,
        userid: userid,
        // peopleid: peopleid,
        orgid: orgid
    })
    let savedComment = await newcomment.save()
    if (savedComment != null) {
        res.redirect('/users/organization/' + orgid)
    }
})

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
    const twitter = req.body.xlink
    const linkedin = req.body.linkedinlink
    const cblink = req.body.cblink
    const founded = req.body.founded

    const neworg = await models.Organization.build({
        orgname: orgname,
        description: description,
        location: location,
        website: website,
        twitter: twitter,
        linkedin: linkedin,
        cblink: cblink,
        founded: founded
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
    const cblink = req.body.cblink
    const userid = req.session.user.userId

    const newperson = await models.People.build({
        firstname: firstname,
        lastname: lastname,
        location: location,
        linkedin: linkedin,
        twitter: twitter,
        email: email,
        source: source,
        cblink: cblink,
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