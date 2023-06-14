const express = require('express')
const app = express()
const routers = require('./src/routers/index')
const db = require('./src/config/db')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routers)

db.connect()
    .then(() => {
        app.listen(8000, () => {
            console.log('app running on port 8000')
        })
    })
    .catch((e) => {
        console.log(e)
    })