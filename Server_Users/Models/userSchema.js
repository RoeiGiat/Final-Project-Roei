/*
When we create the admin the following details will be entered manuall
userSchena.js => 
    UserName: String,
    Password: String,
    Email: String,
    EmailPassword: String,
    Admin: Boolean
----------------------------------
Permissions.json => 
    {
        "id": id from db of admin,
        "Permissions": [
            ** example of permissions : **
            "View Subscriptions",
            "Create Subscriptions",
            "Delete Subscriptions",
            "View Movies",
            "Create Movies",
            "Delete Movies",
            "Update Movies",
            "Update Subscriptions"
        ]
    }
----------------------------------
Users.json => {
    "id": id from db of admin,
    "FirstName" : String
    "LastName": String,
    "CreatedDate": String,
    "SessionTimeOut": Number,
    "Passport": String(*url*)
}
*/

let mongoose = require("mongoose")

let appSchema = mongoose.Schema


let UserSchema = new appSchema({
    UserName: String,
    Password: String,
    Email: String,
    EmailPassword: String,
    Admin: Boolean
})

module.exports = mongoose.model('users', UserSchema)
