var express = require('express')
var appRouter = express.Router()
var userBL = require('../Models/userBL')

appRouter.route('/').get(async (req, resp) => {
    var users = await userBL.Get()
    return resp.json(users)
})

appRouter.route('/:id').get(async (req, resp) => {
    var id = req.params.id
    var user = await userBL.GetById(id)
    return resp.json(user)
})

appRouter.route('/').post(async (req, resp) => {
    var userObj = req.body
    var result = await userBL.Post(userObj)
    return resp.json(result)
})

appRouter.route('/:id').put(async (req, resp) => {
    var id = req.params.id
    var userObj = req.body
    var result = await userBL.Put(id, userObj)
    return resp.json(result)
})

appRouter.route('/:id').delete(async (req, resp) => {
    var id = req.params.id
    var result = await userBL.Delete(id);
    return resp.json(result)
})

module.exports = appRouter