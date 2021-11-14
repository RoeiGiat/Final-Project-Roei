import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import axios from 'axios';
import util from './Utils';
import UsersComp from './UsersComp';
import MoviesComp from './MoviesComp';
import SubscriptionsComp from './SubscriptionsComp';

//Links for server
const UsersLink = "http://localhost:3000/users/"
const MoviesLink = "http://localhost:3000/movies/"
const MembersLink = "http://localhost:3000/members/"
const SubscriptionsLink = "http://localhost:3000/subscriptions/"

const Main = (props) => {
    const [users, setUsers] = useState(["", "", ""]) //All users Data  
    const [loginUser, setUser] = useState(["", "", ""]) //Data of user that log in    
    const [movies, setMovies] = useState([])
    const [members, setMembers] = useState([])
    const [subscriptions, setSubscriptions] = useState([])

    const [newUser, setNewUser] = useState({ fname: undefined, lname: undefined, userName: undefined, sessionTimeout: undefined, })
    const [newMovie, setNewMovie] = useState({ moviename: "", genres: "", imgurl: "", premiered: "" })
    const [newMember, setNewMember] = useState({ Name: "", Email: "", City: "" })
    const [newPermissions, setNewPermissions] = useState(["View Subscriptions", "View Movies"])
    const [str, setStr] = useState({ text: "", visible: "none" })
    const [fleg, setFleg] = useState(false) //Changes when there is an action in the database
    const [timer, setTimer] = useState({ min: 0, sec: 60 })

    //Visibilty
    const [visibility, setVisibility] = useState({ userManagement: "none", users: "none", addUser: "none", movies: "none", allMovies: "none", addMovie: "none", subscriptions: "none", allSubscriptions: "none", addSubscriptions: "none" })

    // Get and save all data from DB 
    useEffect(async () => {
        let UsersData = await axios.get(UsersLink); setUsers(UsersData.data) //UsersData.data => [ [{user login data}...] , [{user data}...] , [{id , [permissions]}...] ]
        let UserData = await axios.get(UsersLink + props.match.params.id); setUser(UserData.data)   //UserData.data => [{user login data}, {user data} , {id , [permissions]}]
        let movies = await axios.get(MoviesLink); setMovies(movies.data)
        let members = await axios.get(MembersLink); setMembers(members.data)
        let subscriptions = await axios.get(SubscriptionsLink); setSubscriptions(subscriptions.data)
    }, [fleg])

    //Initializing timer
    useEffect(() => {
        setTimer({ min: loginUser[1].SessionTimeOut - 1, sec: 59 })
    }, [loginUser])

    //Start timer
    useEffect(() => {
        const interval = setInterval(() => {
            if (timer.sec < 11 && timer.sec != 0) { setTimer({ ...timer, sec: "0" + ((timer.sec) - 1) }) }
            else if (timer.min == 0 && timer.sec == 0) { props.history.push("/") }
            else if (timer.sec == 0) { setTimer({ min: timer.min - 1, sec: 59 }) }
            else { setTimer({ ...timer, sec: timer.sec - 1 }) }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    //A function that adds a new item (Post)
    const Save = async (Link, body) => {
        await axios.post(Link, body) //Post operation according to the structure(schema) of the fileBL in server
        setFleg(!fleg)
    }

    //A function that receives a parameter => update/delete => and performs the operation accordingly (Put/Delete)
    const DoAction = async (action, Link) => {
        action[0] == "delete" ? await axios.delete(Link + action[1]) : await axios.put(Link + action[0], action[1])  //action[0] => id(case update) or 'delete'(case delete) , action[1] => new user(case update) or id(case delete)  
        setFleg(!fleg)
    }

    //Users Component
    let usersArray = []; let moviesArray = []; let subscriptionsArray = [];
    if (visibility.userManagement == 'block') {
        usersArray = users[0].map((user, index) =>
            <UsersComp login={user} data={users[1][index]} permissions={users[2][index]} resp={(action) => { DoAction(action, UsersLink) }} key={index} /> //user => user & password , users[1][index] => firstname,lastname.... , user[2][index] => user permissions
        )
    }

    //Movies Component
    else if (visibility.movies == "block") {
        moviesArray = movies.filter((movie) => movie.Name.includes(str.text)).map((movie, index) =>
            <MoviesComp movie={movie} members={members} subs={subscriptions} resp={(action) => { DoAction(action, MoviesLink) }} permissions={loginUser[2].Permissions} callback={() => { setVisibility({ ...visibility, movies: "none", allMovies: "none", subscriptions: "block", allSubscriptions: "block" }) }} key={index} />)
    }

    //Subscription Component
    else if (visibility.subscriptions == "block") {
        subscriptionsArray = members.map((member, index) =>
            <SubscriptionsComp movies={movies} member={member} permissions={loginUser[2].Permissions} subs={subscriptions} action={(body, link) => { DoAction(body, link) }} post={(body, link) => { Save(link, body) }} callback={() => { setVisibility({ ...visibility, movies: "block", allMovies: "block", subscriptions: "none", allSubscriptions: "none" }) }} key={index} />)
    }

    let text;
    loginUser[0].Admin ? text = "User Management" : text = <del> User Management </del>

    return (

        // --------------------------------------------------------------------------------------- 
        //Menu

        < div >
            <div className="foot">
                <h1> {`Movies - Subscriptions Web Site`}  </h1>
                <h2> {`Hello ${loginUser[1].FirstName}`}  </h2>
                <br />

                <p> Time Left  {`${timer.min}:${timer.sec} mins`}</p>

                <nav className="navMenu">
                    <a href="#" onClick={() => { setVisibility({ ...visibility, movies: "block", userManagement: "none", allMovies: "block", subscriptions: "none" }) }}>Movies</a>

                    <a href="#" onClick={() => { setVisibility({ ...visibility, movies: "none", userManagement: "none", subscriptions: "block", allSubscriptions: "block" }) }}>Subscriptions</a>

                    {/* Only admin has access to this action */}
                    <a href="#" onClick={() => { if (loginUser[0].Admin) { setVisibility({ ...visibility, movies: "none", users: "block", userManagement: "block", subscriptions: "none" }) } }} > {text} </a> {/* => User Management */}

                    <Link to="/" > Log Out</Link>
                    <div className="dot"></div>
                </nav>

            </div>
            <br /><br /><br /><br /><br /><br />


            {/* --------------------------------------------------------------------------------------- */}
            {/* User Management */}

            {/* visible or not visible according to what is selected in the menu */}
            <div className={visibility.userManagement}>
                <div className="regulerBorder">
                    <h3> <u> Users </u> </h3> <br />
                    <div className="margin-left" >
                        <input type="button" value="All Users" onClick={() => { setVisibility({ ...visibility, addUser: "none", users: "block" }) }} />
                        <input type="button" value="Add User" onClick={() => { setVisibility({ ...visibility, addUser: "block", users: "none" }) }} /> <br /><br />
                    </div>

                    {/*Show all users from another comp */}
                    <div className={visibility.users}>
                        {usersArray}
                    </div>


                    {/* Add user in the same "page" */}
                    <div className={visibility.addUser}>
                        <h3> <u> Add New User </u> </h3> <br />
                        <div className="margin-left">

                            <div className="form__group">
                                <input type="text" className="form__input" id="fname" placeholder="First Name" onChange={(e) => { setNewUser({ ...newUser, fname: e.target.value }) }} />
                                <label htmlFor="fname" className="form__label">First Name</label>

                                <input type="text" className="form__input" id="lname" placeholder="Last Name" onChange={(e) => { setNewUser({ ...newUser, lname: e.target.value }) }} />
                                <label htmlFor="lname" className="form__label">Last Name</label>

                                <input type="text" className="form__input" id="username" placeholder="User Name" onChange={(e) => { setNewUser({ ...newUser, userName: e.target.value }) }} />
                                <label htmlFor="username" className="form__label">User Name</label>

                                <input type="number" className="form__input" id="timeout" placeholder="Session Time Out (Minutes)" onChange={(e) => { setNewUser({ ...newUser, sessionTimeout: e.target.value }) }} />
                                <label htmlFor="timeout" className="form__label">Session Time Out (Minutes)</label>

                            </div>

                            <p> Permissions: </p>

                            <div className="flex">
                                <div>
                                    {/* Minimum permission */}
                                    <p> <input type="checkbox" checked={true} readOnly />  View Subscriptions  </p>
                                    {/* Optional permission */}
                                    <p> <input type="checkbox" onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Create Subscriptions", newPermissions)) }} /> Create Subscriptions </p>
                                    <p> <input type="checkbox" onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Delete Subscriptions", newPermissions)) }} /> Delete Subscriptions </p>
                                    <p> <input type="checkbox" onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Update Subscriptions", newPermissions)) }} /> Update Subscriptions </p>
                                </div>

                                <div className="margin-left">
                                    {/* Minimum permission */}
                                    <p> <input type="checkbox" checked={true} readOnly /> View Movies </p>
                                    {/* Optional permission */}
                                    <p> <input type="checkbox" onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Create Movies", newPermissions)) }} /> Create Movies </p>
                                    <p> <input type="checkbox" onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Delete Movies", newPermissions)) }} /> Delete Movies </p>
                                    <p> <input type="checkbox" onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Update Movies", newPermissions)) }} />  Update Movies </p>
                                </div>
                            </div>

                            <br /><br />

                            <input type="button" value="Save" onClick={() => {
                                Save(UsersLink, [
                                    { UserName: newUser.userName, Password: undefined, Email: loginUser[0].Email },
                                    { FirstName: newUser.fname, LastName: newUser.lname, CreatedDate: util.GetDate(), SessionTimeOut: parseInt(newUser.sessionTimeout), Passport: "" },
                                    { Permissions: newPermissions }
                                ]);
                                setVisibility({ ...visibility, addUser: "none", users: "block" })
                            }} />
                            <input type="button" value="Cancel" onClick={() => { setVisibility({ ...visibility, addUser: "none", users: "block" }) }} /> <br /><br />

                        </div>
                    </div>

                </div>
            </div>


            {/* --------------------------------------------------------------------------------------- */}
            {/* Movies : */}

            {/* visible or not visible according to what is selected in the menu */}
            <div className={visibility.movies}>
                <div className="regulerBorder">
                    <h3> <u> Movies </u> </h3> <br />
                    <div className="margin-left" >
                        <input type="button" value="All Movies" onClick={() => { setVisibility({ ...visibility, addMovie: "none", allMovies: "block" }) }} />
                        <input type="button" value="Add Movie" onClick={() => { if (util.CheckPermission("Create Movies", loginUser[2].Permissions)) { setVisibility({ ...visibility, addMovie: "block", allMovies: "none" }) } }} /> <br /><br />
                        <input placeholder="search for a movie*" onChange={(e) => { setStr({ visible: "none", text: e.target.value }) }} /> <br />
                        {/* <p className={str.visible} > oops not found, try again! </p> => not work */}
                        <br /><br />
                    </div>


                    {/*Show all movies from another comp */}
                    <div className={visibility.allMovies}>
                        {moviesArray}
                    </div>

                    {/* Add movie in the same "page" */}
                    <div className={visibility.addMovie}>
                        <h3> <u> Add New Movie </u> </h3> <br />
                        <div className="margin-left">
                            <div className="form__group">
                                <input type="text" className="form__input" id="moviename" placeholder="Movie Name" onChange={(e) => { setNewMovie({ ...newMovie, moviename: e.target.value }) }} />
                                <label htmlFor="moviename" className="form__label">Movie Name</label>

                                <input type="text" className="form__input" id="genres" placeholder="Genres" onChange={(e) => { setNewMovie({ ...newMovie, genres: e.target.value }) }} />
                                <label htmlFor="genres" className="form__label">Genres</label>

                                <input type="text" className="form__input" id="imgurl" placeholder="Image Url" onChange={(e) => { setNewMovie({ ...newMovie, imgurl: e.target.value }) }} />
                                <label htmlFor="imgurl" className="form__label">Image Url</label>

                                <input type="number" className="form__input" id="premiered" placeholder="Premiered" onChange={(e) => { setNewMovie({ ...newMovie, premiered: e.target.value }) }} />
                                <label htmlFor="premiered" className="form__label">Premiered</label>
                            </div>
                            <br /><br />
                            <input type="button" value="Save" onClick={() => { Save(MoviesLink, { Name: newMovie.moviename, Genres: [newMovie.genres, "", ""], Image: newMovie.imgurl, Premiered: newMovie.premiered }); setVisibility({ ...visibility, addMovie: "none", allMovies: "block" }) }} />
                            <input type="button" value="Cancel" onClick={() => { setVisibility({ ...visibility, addMovie: "none", allMovies: "block" }) }} /> <br /><br />

                        </div>

                    </div>
                </div>
            </div >
            {/* --------------------------------------------------------------------------------------- */}
            {/* Subscriptions: */}

            {/* visible or not visible according to what is selected in the menu */}
            <div className={visibility.subscriptions}>
                <div className="regulerBorder">
                    <h3> <u> Subscriptions </u> </h3> <br />
                    <div className="margin-left" >
                        <input type="button" value="All Members" onClick={() => { setVisibility({ ...visibility, addSubscriptions: "none", allSubscriptions: "block" }) }} />
                        <input type="button" value="Add Member" onClick={() => { if (util.CheckPermission("Create Subscriptions", loginUser[2].Permissions)) setVisibility({ ...visibility, addSubscriptions: "block", allSubscriptions: "none" }) }} /> <br /><br />
                    </div>


                    {/*Show all members from another comp */}
                    <div className={visibility.allSubscriptions}>
                        {subscriptionsArray}
                    </div>

                    {/* Add member in the same "page" */}
                    <div className={visibility.addSubscriptions}>
                        <h3> <u> Add New Members </u> </h3> <br />
                        <div className="margin-left">
                            <div className="form__group">
                                <input type="text" className="form__input" id="name" placeholder="Full Name" onChange={(e) => { setNewMember({ ...newMember, Name: e.target.value }) }} />
                                <label htmlFor="name" className="form__label">Full Name</label>

                                <input type="text" className="form__input" id="email" placeholder="Email" onChange={(e) => { setNewMember({ ...newMember, Email: e.target.value }) }} />
                                <label htmlFor="email" className="form__label">Email</label>

                                <input type="text" className="form__input" id="city" placeholder="City" onChange={(e) => { setNewMember({ ...newMember, City: e.target.value }) }} />
                                <label htmlFor="city" className="form__label">City</label>
                            </div>
                            <br /><br />
                            <input type="button" value="Save" onClick={() => { Save(MembersLink, newMember); setVisibility({ ...visibility, addSubscriptions: "none", allSubscriptions: "block" }) }} />
                            <input type="button" value="Cancel" onClick={() => { setVisibility({ ...visibility, addSubscriptions: "none", allSubscriptions: "block" }) }} /> <br /><br />

                        </div>

                    </div>
                </div>
            </div >
        </div >
    );
};

export default Main;