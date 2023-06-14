const express = require('express')
const route = express.Router()

const movee = require('./movee')
const schedulee = require('./schedulee')
const bookinge = require('./bookinge')
const usere = require('./usere')
const auth = require('./auth')

route.use('/movies', movee)
route.use('/schedule', schedulee)
route.use('/booking', bookinge)
route.use('/user', usere)
route.use('/auth', auth)

module.exports = route