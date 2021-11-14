let Members = require("./memberSchema")
let axios = require("axios")
const ApiLink = ("https://jsonplaceholder.typicode.com/users")
const MembersDBLink = "http://localhost:8000/members/"


let Start = async () => {       //Got Data from api && Make sure the operation happens only once
    let resp = await axios.get(MembersDBLink)
    if (resp.data.length == 0) {
        let api = await axios.get(ApiLink)
        api.data.map((user) => { axios.post(MembersDBLink, { Name: user.name, Email: user.email, City: user.address.city }) })
    }
    else {
        console.log("DB already get data from api users");
    }

}

let Get = () => {
    return new Promise((resolve, reject) => {
        Members.find({}, (err, data) => {
            err ? reject(err) : resolve(data);
        })
    })
}

let GetById = (id) => {
    return new Promise((resolve, reject) => {
        Members.findById(id, (err, data) => {
            err ? reject(err) : resolve(data);
        })
    })
}

let Post = (newMember) => {
    return new Promise((resolve, reject) => {
        let newItem = new Members({
            Name: newMember.Name,
            Email: newMember.Email,
            City: newMember.City
        })
        newItem.save((err) => {
            err ? reject(err) : resolve("Member is add");
        })
    })
}



let Put = (id, newMember) => {
    return new Promise((resolve, reject) => {
        let newItem = {
            Name: newMember.Name,
            Email: newMember.Email,
            City: newMember.City
        }
        Members.findByIdAndUpdate(id, newItem, (err) => {
            err ? reject(err) : resolve("Member is update");
        })
    })
}

let Delete = (id) => {
    return new Promise((resolve, reject) => {
        Members.findByIdAndDelete(id, (err) => {
            err ? reject(err) : resolve("Member is delete");
        })
    })
}

Start()

module.exports = { Get, GetById, Post, Put, Delete }