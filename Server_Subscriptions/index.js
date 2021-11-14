var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var memberController = require('./Controllers/membersController')
var moviesController = require('./Controllers/moviesController')
var subController = require('./Controllers/subController')


require('./Configs/ProjectDB')

var app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json())
app.use('/movies', moviesController)
app.use('/members', memberController)
app.use('/subscriptions', subController)

app.listen(8000, () => {
    console.log("The server is UP");
})