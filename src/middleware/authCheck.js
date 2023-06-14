const respone = require('../helpers/response')
const jwt = require('jsonwebtoken')

const authCheck = (...roles) => {
    return (req, res, next) => {
        const { authorization } = req.headers
        let isValid = false

        if (!authorization) {
            return respone(res, 401, 'silahkan login terlebih dahulu')
        }
        
        const token = authorization.replace('Bearer ', '')
        console.log(token)
        jwt.verify(token, process.env.SECRET_KEYS, (err, decode) => {
            if (err) {
                return respone(res, 401, err)
            }

            // console.log(decode)

            roles.forEach((v) => {
                if (v == decode.role) {
                    isValid = true
                    return
                }
            })

            if (isValid) {
                req.user = decode.data
                return next()
            } else {
                return respone(res, 401, 'anda tidak punya akses')
            }
        })
    }
}

module.exports = authCheck