let mongoose = require("mongoose")

let appSchema = mongoose.Schema

let MemberSchema = new appSchema({
    Name: String,
    Email: String,
    City: String
})


module.exports = mongoose.model('members', MemberSchema)
