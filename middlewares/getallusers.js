const models = require('../models')

function getAllUsers(req,res,next) {

    let allusers = models.User.findAll()
    return allusers
}

module.exports = getAllUsers