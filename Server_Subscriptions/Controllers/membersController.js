var express = require('express')
var appRouter = express.Router()
var membersBL = require('../Models/Members/membersBL')

appRouter.route('/').get(async (req, resp) => {
    var members = await membersBL.Get()
    return resp.json(members)
})

appRouter.route('/:id').get(async (req, resp) => {
    var id = req.params.id
    var member = await membersBL.GetById(id)
    return resp.json(member)
})

appRouter.route('/').post(async (req, resp) => {
    var memberObj = req.body
    var result = await membersBL.Post(memberObj)
    return resp.json(result)
})

appRouter.route('/:id').put(async (req, resp) => {
    var id = req.params.id
    var memberObj = req.body
    var result = await membersBL.Put(id, memberObj)
    return resp.json(result)
})

appRouter.route('/:id').delete(async (req, resp) => {
    var id = req.params.id
    var result = await membersBL.Delete(id);
    return resp.json(result)
})

module.exports = appRouter