import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import util from './Utils'

const MoviesComp = (props) => {
    const [visibilty, setVisibilty] = useState({ allmovies: "block", edit: "none" })
    const [newMovie, setNewMovie] = useState({ moviename: props.movie.Name, genres: props.movie.Genres, imgurl: props.movie.Image, premiered: props.movie.Premiered })

    //A function that returns the names and viewing dates of all members who made a subscriptions for the same film
    const GetMembers = () => {
        return props.subs.map((sub) => {  //props.subs = [{ _id, MemberId : id, Movies : [MovieId : id, Date : date ] ....  }]
            return props.members.map((member) => { //props.member = [{ _id, Name : name , Email : email  ,City: city}]
                if (member._id == sub.MemberId) {
                    for (let i = 0; i < sub.Movies.length; i++) {
                        if (sub.Movies[i].MovieId == props.movie._id) { //if member watched this movies, get member name and date of watching 
                            return <li className="margin-left"> <a href="#"> <u onClick={() => { props.callback() }}> {member.Name} </u> </a>, {sub.Movies[i].Date} </li>
                        }
                    }
                }
            })
        })
    }

    let subs = GetMembers()

    return (
        <div>
            <div className={visibilty.allmovies}>
                <div className="border">
                    <b> {`${props.movie.Name} ,${new Date(props.movie.Premiered).getFullYear()} `} </b> <br />
                    genres: {`${props.movie.Genres[0]} ${props.movie.Genres[1]} ${props.movie.Genres[2]}`} <br /><br />

                    <div className="flex">
                        <img src={props.movie.Image} ></img>

                        <div className="subBorder">
                            <b>subscriptions watched</b> <br /> <br />
                            <ul className="margin-left">
                                {subs}
                            </ul>
                            <br />
                        </div>

                    </div>
                    <br />
                    <input type="button" value="Edit" onClick={() => { if (util.CheckPermission("Update Movies", props.permissions)) { setVisibilty({ allmovies: "none", edit: "block" }) } }} />
                    <input type="button" value="Delete" onClick={() => { if (util.CheckPermission("Delete Movies", props.permissions)) { props.resp(["delete", props.movie._id]) } }} /> <br /><br />
                </div>
            </div>

            {/* Edit Page */}
            <div className={visibilty.edit}>
                <div className="border">
                    Movie Name : <input placeholder={props.movie.Name} onChange={(e) => { setNewMovie({ ...newMovie, moviename: e.target.value }) }} /> <br /><br />
                    Genres :  <input placeholder={props.movie.Genres} onChange={(e) => { setNewMovie({ ...newMovie, genres: e.target.value }) }} /> <br /><br />
                    Img Url : <input placeholder="Image" onChange={(e) => { setNewMovie({ ...newMovie, imgurl: e.target.value }) }} /> <br /><br />
                    Premiered : <input placeholder={new Date(props.movie.Premiered).getFullYear()} onChange={(e) => { setNewMovie({ ...newMovie, premiered: e.target.value }) }} /><br /><br />

                    <br /><br />

                    <input type="button" value="Update" onClick={() => { setVisibilty({ allmovies: "block", edit: "none" }); props.resp([props.movie._id, newMovie]) }} />
                    <input type="button" value="Cancel" onClick={() => { setVisibilty({ allmovies: "block", edit: "none" }) }} />
                </div>
            </div>
        </div >
    );
};

export default MoviesComp;