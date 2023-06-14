const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/schedules')
const authCheck = require('../middleware/authCheck')

// route.get('/', ctrl.getData)
route.post('/', authCheck('admin'), ctrl.saveData)
route.put('/:id', authCheck('admin'), ctrl.updateData)
route.delete('/:id', authCheck('admin'), ctrl.deleteData)
route.get('/', authCheck('admin', 'user'), ctrl.fetchBy)

module.exports = route