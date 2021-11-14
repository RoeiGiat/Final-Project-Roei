var express = require('express')
var appRouter = express.Router()
var moviesBL = require('../Models/Movies/moviesBL')

appRouter.route('/').get(async (req, resp) => {
    var movie = await moviesBL.Get()
    return resp.json(movie)
})

appRouter.route('/:id').get(async (req, resp) => {
    var id = req.params.id
    var movie = await moviesBL.GetById(id)
    return resp.json(movie)
})

appRouter.route('/').post(async (req, resp) => {
    var movieObj = req.body
    var result = await moviesBL.Post(movieObj)
    return resp.json(result)
})

appRouter.route('/:id').put(async (req, resp) => {
    var id = req.params.id
    var movieObj = req.body
    var result = await moviesBL.Put(id, movieObj)
    return resp.json(result)
})

appRouter.route('/:id').delete(async (req, resp) => {
    var id = req.params.id
    var result = await moviesBL.Delete(id);
    return resp.json(result)
})

module.exports = appRouter