let express = require('express')
let appRouter = express.Router()
let userBL = require('../Models/userBL')
const MembersLink = "http://localhost:8000/members/"

appRouter.route('/').get(async (req, resp) => {
    let users = await userBL.GetFromServer(MembersLink)
    return resp.json(users)
})

appRouter.route('/').post(async (req, resp) => {
    let userObj = req.body
    let result = await userBL.PostFromServer(MembersLink, userObj)
    return resp.json(result)
})

appRouter.route('/:id').put(async (req, resp) => {
    let id = req.params.id
    let userObj = req.body
    let result = await userBL.PutFromServer(MembersLink, id, userObj)
    return resp.json(result)
})

appRouter.route('/:id').delete(async (req, resp) => {
    let id = req.params.id
    let result = await userBL.DeleteFromServer(MembersLink, id);
    return resp.json(result)
})

module.exports = appRouter