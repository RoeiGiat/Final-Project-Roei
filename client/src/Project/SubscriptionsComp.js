import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import util from './Utils'

const MembersLink = "http://localhost:80/members/"
const SubscriptionsLink = "http://localhost:80/subscriptions/"

const SubscriptionsComp = (props) => {
    const [visibility, setVisibility] = useState({ allSubs: "block", edit: "none" })
    const [select, setSelect] = useState(0)
    const [newMember, setMember] = useState({ Name: props.member.Name, Email: props.member.Email, City: props.member.City })

    //A function that checks if the viewer has already subscribe the movie
    const Valid = (movie, member) => {
        let valid = member.Movies.filter(item => movie._id == item.MovieId)
        return valid.length > 0 ? alert("Sorry, Cant Subscribe This Movie") : true;
    }

    //A function that returns in a list the name and date of all the movies the member has watched
    const GetMoviesWatchedData = (moviesWatched) => { //moviesWatched = [MovieId : id , Date : date]
        return props.movies.map((movie) => {
            for (let i = 0; i < moviesWatched.length; i++) {
                if (movie._id == moviesWatched[i].MovieId) {
                    return <li className="margin-left"> <a href="#"> <u onClick={() => { props.callback() }}> {movie.Name} </u> </a>,  {moviesWatched[i].Date}  </li>
                }
            }
        })
    }

    //A function finds the requested user by Id and all the movies he watched 
    const MemberIsExisting = () => {
        let member = props.subs.filter((sub) => props.member._id == sub.MemberId)
        return member.length > 0 ? true : false
    }

    let movies = props.movies.map((movie, index) => { return <option value={index}> {movie.Name} </option> }); //new viewer
    let member = props.subs.filter((sub) => props.member._id == sub.MemberId) //Finds the requested user by Id and all the movies he watched
    let moviesWatched = [];

    let firstWatch = true;
    //Conditions to know if the viewer has watched at least one movie or not (necessary to know to make a Post or Put accordingly))
    if (MemberIsExisting()) {
        moviesWatched = GetMoviesWatchedData(member[0].Movies)
        firstWatch = false
    }


    return (
        <div>
            <div className={visibility.allSubs}>
                <div className="border">
                    <h1> {props.member.Name} </h1> <br />
                    Email : <b> {props.member.Email} </b> <br />
                    City : <b> {props.member.City} </b> <br /><br />

                    <input type="button" value="Edit" onClick={() => { if (util.CheckPermission("Update Subscriptions", props.permissions)) setVisibility({ edit: "block", allSubs: "none" }) }} />
                    <input type="button" value="Delete" onClick={() => { if (util.CheckPermission("Delete Subscriptions", props.permissions)) props.action(["delete", props.member._id], MembersLink) }} /> <br /><br />

                    <div className="subBorder">
                        <h1> Movie Watched </h1>
                        <br />

                        <ul className="margin-left">
                            {moviesWatched}
                        </ul>

                        <div className="flex">
                            <select onChange={(e) => { setSelect(e.target.value) }}>
                                {movies}
                            </select>

                            <input type="button" value="Subscribe" onClick={() => {
                                if (util.CheckPermission("Create Subscriptions", props.permissions)) {
                                    if (member != undefined) {
                                        if (firstWatch) {
                                            props.post({ MemberId: props.member._id, Movies: [{ MovieId: props.movies[select]._id, Date: util.GetDate() }] }, SubscriptionsLink)
                                        }
                                        else if (Valid(props.movies[select], member[0])) {
                                            member[0].Movies.push({ MovieId: props.movies[select]._id, Date: util.GetDate() })
                                            let newMember = { MemberId: props.member._id, Movies: member[0].Movies }
                                            props.action([member[0]._id, newMember], SubscriptionsLink)
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>


            <div className={visibility.edit}>
                <div className="border">
                    Name: <input placeholder={props.member.Name} onChange={(e) => { setMember({ ...newMember, Name: e.target.value }) }} /> <br /> <br />
                    Email : <input placeholder={props.member.Email} onChange={(e) => { setMember({ ...newMember, Email: e.target.value }) }} /> <br /><br />
                    City : <input placeholder={props.member.City} className="margin-left" onChange={(e) => { setMember({ ...newMember, City: e.target.value }) }} /> <br /><br />



                    <input type="button" value="Update" onClick={() => { props.action([props.member._id, newMember], MembersLink); setVisibility({ edit: "none", allSubs: "block" }); }} />
                    <input type="button" value="Cancel" onClick={() => { setVisibility({ edit: "none", allSubs: "block" }) }} /> <br /><br />
                </div>
            </div>

        </div >
    );
};

export default SubscriptionsComp;
