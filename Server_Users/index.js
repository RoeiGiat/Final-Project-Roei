let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let userController = require('./Controllers/userController')
let subController = require('./Controllers/subController')
let moviesController = require('./Controllers/moviesController')
let membersController = require('./Controllers/memberController')

require('./Config/usersDB')

let app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json())
app.use('/users', userController)
app.use('/subscriptions', subController)
app.use('/movies', moviesController)
app.use('/members', membersController)


app.listen(3000, () => {
    console.log("The server is UP");
})