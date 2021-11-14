let Subs = require("./subSchema")

const Get = async () => {
    return new Promise((resolve, reject) => {
        Subs.find({}, (err, subscriptions) => {
            err ? reject(err) : resolve(subscriptions);
        })
    })
}

const GetById = (id) => {
    return new Promise((resolve, reject) => {
        Sub.findById(id, (err, data) => {
            err ? reject(err) : resolve(data)
        })
    })
}

const Post = (newSub) => {
    console.log(newSub);
    return new Promise((resolve, reject) => {
        let newItem = new Subs({
            MemberId: newSub.MemberId,
            Movies: [{
                MovieId: newSub.Movies[0].MovieId,
                Date: newSub.Movies[0].Date
            }]
        })
        newItem.save((err) => {
            err ? reject(err) : resolve("Subscription is add");
        })
    })
}

const Put = (id, newSub) => {
    console.log(id);
    console.log(newSub);
    return new Promise((resolve, reject) => {
        let newItem = {
            MemberId: newSub.MemberId,
            Movies: newSub.Movies,
        }
        Subs.findByIdAndUpdate(id, newItem, (err) => {
            err ? reject(err) : resolve("Subscription is add");
        })
    })
}

const Delete = (id) => {
    return new Promise((resolve, reject) => {
        Subs.findByIdAndDelete(id, (err) => {
            err ? reject(err) : resolve("Subscription is add");
        })
    })
}


module.exports = { Get, GetById, Post, Put, Delete }