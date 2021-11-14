let mongoose = require("mongoose")

let appSchema = mongoose.Schema

let SubSchema = new appSchema({
    MemberId: String,
    Movies: [{
        MovieId: String,
        Date: String
    }],
})


module.exports = mongoose.model('subscriptions', SubSchema)
