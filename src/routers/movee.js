const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/movies')
const authCheck = require('../middleware/authCheck')
const upload = require('../middleware/upload')

// route.get('/', ctrl.getData)
route.post('/',authCheck('admin'), upload.single('image'), ctrl.saveData)
route.put('/:id', authCheck('admin'), upload.single('image'), ctrl.UpdateMovie)
route.delete('/:id', authCheck('admin'), ctrl.deleteData)
route.get('/search', authCheck('admin', 'user'), ctrl.SearchMovie)
route.get('/', authCheck('admin', 'user'), ctrl.fetchBy)

module.exports = route