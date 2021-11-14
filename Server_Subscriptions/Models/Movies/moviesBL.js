let movies = require("./moviesSchema")
let axios = require("axios")
const ApiLink = ("https://api.tvmaze.com/shows")
const MovieDBLink = "http://localhost:8000/movies/"

let Start = async () => {       //Got Data from api && Make sure the operation happens only once
    let resp = await axios.get(MovieDBLink)
    if (resp.data.length == 0) {
        let api = await axios.get(ApiLink)
        api.data.slice(0, 10).map((movie) => {
            axios.post(MovieDBLink, {
                Name: movie.name,
                Genres: movie.genres,
                Image: movie.image.medium,
                Premiered: movie.premiered
            })
        })
    }
    else {
        console.log("DB already got data from api movies");
    }

}

let Get = () => {
    return new Promise((resolve, reject) => {
        movies.find({}, (err, data) => {
            err ? reject(err) : resolve(data);
        })
    })
}

let GetById = (id) => {
    return new Promise((resolve, reject) => {
        movies.findById(id, (err, data) => {
            err ? reject(err) : resolve(data);
        })
    })
}

let Post = (newMovie) => {
    return new Promise((resolve, reject) => {
        let newItem = new movies({
            Name: newMovie.Name,
            Genres: newMovie.Genres,
            Image: newMovie.Image,
            Premiered: newMovie.Premiered,
        })
        newItem.save((err) => {
            err ? reject(err) : resolve("Movie is add");
        })
    })
}



let Put = (id, newMovie) => {
    return new Promise((resolve, reject) => {
        let newItem = {
            Name: newMovie.Name,
            Genres: newMovie.Genres,
            Image: newMovie.Image,
            Premiered: newMovie.Premiered,
        }
        movies.findByIdAndUpdate(id, newItem, (err) => {
            err ? reject(err) : resolve("Movie is update");
        })
    })
}

let Delete = (id) => {
    return new Promise((resolve, reject) => {
        movies.findByIdAndDelete(id, (err) => {
            err ? reject(err) : resolve("Movie is delete");
        })
    })
}


Start()

module.exports = { Get, GetById, Post, Put, Delete }