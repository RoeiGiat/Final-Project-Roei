let mongoose = require("mongoose")

let appSchema = mongoose.Schema

let MovieSchema = new appSchema({
    Name: String,
    Genres: Array,
    Image: String,
    Premiered: Date
})


module.exports = mongoose.model('movies', MovieSchema)
