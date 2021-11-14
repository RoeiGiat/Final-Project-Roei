let express = require('express')
let appRouter = express.Router()
let userBL = require('../Models/userBL')
const SubscriptionsLink = "http://localhost:8000/subscriptions/"

appRouter.route('/').get(async (req, resp) => {
    let users = await userBL.GetFromServer(SubscriptionsLink)
    return resp.json(users)
})

appRouter.route('/').post(async (req, resp) => {
    let userObj = req.body
    let result = await userBL.PostFromServer(SubscriptionsLink, userObj)
    return resp.json(result)
})

appRouter.route('/:id').put(async (req, resp) => {
    let id = req.params.id
    let userObj = req.body
    let result = await userBL.PutFromServer(SubscriptionsLink, id, userObj)
    return resp.json(result)
})

appRouter.route('/:id').delete(async (req, resp) => {
    let id = req.params.id
    let result = await userBL.DeleteFromServer(SubscriptionsLink, id);
    return resp.json(result)
})

module.exports = appRouter