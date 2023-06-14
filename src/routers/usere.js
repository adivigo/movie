const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/users')
const authCheck = require('../middleware/authCheck')

route.get('/', ctrl.fetchData)
route.post('/', ctrl.save)
route.put('/:id', ctrl.update)
route.delete('/', ctrl.delete)

module.exports = route