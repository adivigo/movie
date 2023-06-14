const ctrl = {}
const model = require('../models/users')
const respone = require('../helpers/response')
const bcrypt = require('bcrypt')
const jwt = require('../helpers/jwt')

ctrl.Login = async (req, res) => {
    try {
        const passDb = await model.getByUser(req.body.username)

        if (passDb.length <= 0) {
            return respone(res, 401, 'username tidak terdaftar')
        }

        const passUser = req.body.password
        const check = await bcrypt.compare(passUser, passDb[0].password)

        if (check) {
            const token = await jwt.genToken(req.body.username)
            return respone(res, 200, {
                message: 'token created',
                token
            })
        } else {
            return respone(res, 401, 'password salah')
        }
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

module.exports = ctrl