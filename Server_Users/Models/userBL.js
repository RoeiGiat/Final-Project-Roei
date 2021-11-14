const users = require("./userSchema")
const util = require("../utils")
const nodemailer = require('nodemailer');
const axios = require("axios")
let admin = ""

const GetFromServer = async (Link) => {
    let resp = await axios.get(Link)
    return new Promise(async (resolve) => {
        resolve(resp.data)
    })
}

const PostFromServer = async (Link, newItem) => {
    let resp = await axios.post(Link, newItem)
    return new Promise(async (resolve) => {
        resolve(resp.data)
    })
}

const PutFromServer = async (Link, id, newItem) => {
    let resp = await axios.put(Link + id, newItem)
    return new Promise(async (resolve) => {
        resolve(resp.data)
    })
}

const DeleteFromServer = async (Link, id) => {
    let resp = await axios.delete(Link + id)
    return new Promise(async (resolve) => {
        resolve(resp.data)
    })
}



const Get = async () => {
    return new Promise(async (resolve, reject) => {
        let usersJson = undefined; let permissionsJson = undefined;
        await util.ReadFile('./Users.json').then(data => usersJson = data).catch((err) => console.log(err))
        await util.ReadFile('./Permissions.json').then(data => permissionsJson = data).catch((err) => console.log(err))
        users.find({}, (err, data) => {
            admin = { mail: data[0].Email, password: data[0].EmailPassword };
            err ? reject(err) : resolve([data, usersJson, permissionsJson]);
        })
    })
}


const GetById = (id) => {
    return new Promise(async (resolve, reject) => {
        let usersJson = undefined; let permissionsJson = undefined;
        await util.ReadFile('./Users.json').then(data => usersJson = data).catch((err) => console.log(err))
        let userData = usersJson.filter(user => user.id == id)
        await util.ReadFile('./Permissions.json').then(data => permissionsJson = data).catch((err) => console.log(err))
        let permissions = permissionsJson.filter(user => user.id == id)
        users.findById(id, (err, data) => {
            err ? reject(err) : resolve([data, ...userData, ...permissions])
        })
    })
}

const Post = (newUser) => {
    let arrUsers = []; let arrPermissions = []
    return new Promise((resolve, reject) => {
        let newItem = new users({
            UserName: newUser[0].UserName,
            Password: newUser[0].Password,
            Email: newUser[0].Email,
            EmailPassword: newUser[0].EmailPassword,
            Admin: newUser[0].Admin,
        })
        newItem.save(async (err, user) => {
            if (err)
                reject(err)
            else {
                await util.ReadFile('./Users.json').then(data => { arrUsers = data; arrUsers.push({ id: user._id.toString(), ...newUser[1] }) }).catch((err) => console.log(err))
                util.WriteToFile('./Users.json', arrUsers)
                await util.ReadFile('./Permissions.json').then(data => { arrPermissions = data; arrPermissions.push({ id: user._id.toString(), ...newUser[2] }) }).catch((err) => console.log(err))
                util.WriteToFile('./Permissions.json', arrPermissions)
                resolve("User is add")
            }
        })
    })
}

const Put = async (id, newUser) => {
    let password = CreatePassword(newUser[0].UserName)
    newUser[0].Password == undefined && (newUser[0].Email != undefined) ? SendMail(newUser[0].Email, password) : password = newUser[0].Password;

    let arrUsers = []; let arrPermissions = []; index = undefined
    return new Promise(async (resolve, reject) => {
        let newItem = {
            UserName: newUser[0].UserName,
            Password: password,
            Email: newUser[0].Email,
            EmailPassword: newUser[0].EmailPassword,
            Admin: newUser[0].Admin,
        }
        await util.ReadFile('./Users.json').then((data) => { arrUsers = data; let indexUser = arrUsers.findIndex(user => user.id == id); arrUsers[indexUser] = { id, ...newUser[1] } })
        await util.ReadFile('./Permissions.json').then((data) => { arrPermissions = data; let indexPermiss = arrPermissions.findIndex(permissions => permissions.id == id); arrPermissions[indexPermiss] = { id, ...newUser[2] } })
        util.WriteToFile('./Users.json', arrUsers)
        util.WriteToFile('./Permissions.json', arrPermissions)
        users.findByIdAndUpdate(id, newItem, (err) => {
            err ? reject(err) : resolve("User is update")
        })
    })
}

const Delete = (id) => {
    let arrUsers = []; let arrPermissions = []
    return new Promise((resolve, reject) => {
        users.findByIdAndDelete(id, async (err) => {
            if (err)
                reject(err)
            else {
                await util.ReadFile('./Users.json').then(data => { arrUsers = data; let index = arrUsers.findIndex(user => user.id == id); arrUsers.splice(index, 1) }).catch((err) => console.log(err))
                console.log("after:", arrUsers);
                util.WriteToFile('./Users.json', arrUsers)
                await util.ReadFile('./Permissions.json').then(data => { arrPermissions = data; let index = arrPermissions.findIndex(permission => permission.id == id); arrPermissions.splice(index, 1) }).catch((err) => console.log(err))
                util.WriteToFile('./Permissions.json', arrPermissions)
                resolve("User is delete")
            }
        })
    })
}

//A function that create a new password
const CreatePassword = (username) => {
    let password = Math.floor(Math.random() * 99999) + 10000;
    return password.toString() + username
}


//A function that send mail with a new password
const SendMail = (email, password) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: admin.mail,
            pass: admin.password
        }
    });

    let mailDetails = {
        from: admin.mail,
        to: email,
        subject: 'New Password',
        text: "Your'e new password is: " + password
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}



module.exports = { Get, GetById, Post, Put, Delete, GetFromServer, PostFromServer, PutFromServer, DeleteFromServer }