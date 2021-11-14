const jsonfile = require('jsonfile')

var WriteToFile = (file, obj) => {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(file, obj, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve("Person Created!")
            }
        })
    })
}

var ReadFile = (file) => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(file, (err, data) => {
            err ? reject(err) : resolve(data)
        })
    })
}




module.exports = { WriteToFile, ReadFile }