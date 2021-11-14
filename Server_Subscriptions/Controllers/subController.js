var express = require('express')
var appRouter = express.Router()
var subBL = require('../Models/Subscriptions/subBL')

appRouter.route('/').get(async (req, resp) => {
    var subs = await subBL.Get()
    return resp.json(subs)
})

appRouter.route('/:id').get(async (req, resp) => {
    var id = req.params.id
    var sub = await subBL.GetById(id)
    return resp.json(sub)
})

appRouter.route('/').post(async (req, resp) => {
    var subObj = req.body
    var result = await subBL.Post(subObj)
    return resp.json(result)
})

appRouter.route('/:id').put(async (req, resp) => {
    var id = req.params.id
    var subObj = req.body
    var result = await subBL.Put(id, subObj)
    return resp.json(result)
})

appRouter.route('/:id').delete(async (req, resp) => {
    var id = req.params.id
    var result = await subBL.Delete(id);
    return resp.json(result)
})

module.exports = appRouter