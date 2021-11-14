import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"
const UsersLink = "http://localhost:3000/users/"


const Login = (props) => {
    const [users, setUsers] = useState([])
    const [userName, setName] = useState(undefined)
    const [userPassword, setPassword] = useState("")
    const [newUser, setNewUser] = useState({ username: "", email: "" })
    const [message, setMessage] = useState("")
    const [button, setButtonValue] = useState("")
    const [fleg, setFleg] = useState(false) //flag is set so that each change will return us to a function(useEffect) that retrieves information from the database


    //A function that saves users data
    useEffect(async () => {
        let users = await axios.get(UsersLink)
        setUsers(users.data)  //users = [ {user login data  - username...} , {user data - first name... } ,{ id,  [user permission - view subscription...]}
    }, [fleg])


    //A function that checks if the user exists in the database
    const CheckValidUser = async (e) => {
        e.preventDefault()
        let user = users[0].filter((user) => (user.UserName == userName && (user.Password == userPassword) && (userPassword != undefined))) //Check if user is exists 
        user.length != 0 ? props.history.push(`./MainPage/${user[0]._id}/`) : setMessage("Incorrect username or password, Please try again(!)")
    }


    //A function that checks if the username exists in the database and that the user has entered a new password
    const SignUp = async (e) => {
        e.preventDefault()
        let user = users[0].filter(user => user.UserName == newUser.username);
        user.length != 0 ? UpdatePassword(user[0]._id) : setMessage("Incorrect User Name or Email");
    }

    //A function that saves the new password that the system sent to the user by email and gives the user the option to log in to the system
    const UpdatePassword = async (id) => {
        setMessage("User successfully sign up, email is sent to you with your new password")
        let user = await axios.get(UsersLink + id)
        user.data[0] = { UserName: user.data[0].UserName, Password: undefined, Email: newUser.email, password: "" }
        await axios.put(UsersLink + id, user.data)
        setFleg(!fleg)
    }

    return (
        < div >
            <div className="row">
                <div className="col-md-6 mx-auto p-0">
                    <div className="login-box">
                        <div className="login-snip"> <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked onClick={() => { setMessage("") }} /><label htmlFor="tab-1" className="tab">Login</label> <input id="tab-2" type="radio" name="tab" className="sign-up" /><label htmlFor="tab-2" className="tab" onClick={() => { setButtonValue("Sign Up"); setMessage("") }} >Sign Up</label>
                            <div className="login-space">
                                {/* Log in page design */}
                                <form onSubmit={CheckValidUser}>
                                    <div className="login">
                                        <div className="group"> <label htmlFor="user" className="label">Username</label> <input id="user" type="text" className="input" placeholder="Enter your username" onChange={(e) => { setName(e.target.value); setMessage("") }} /> </div>
                                        <div className="group"> <label htmlFor="pass" className="label">Password</label> <input id="pass" type="password" className="input" data-type="password" placeholder="Enter your password" onChange={(e) => { setPassword(e.target.value); setMessage("") }} /> </div>
                                        <div className="group"> <input id="check" type="checkbox" className="check" defaultChecked /> <label htmlFor="check"><span className="icon"></span> Keep me Signed in</label> </div>
                                        <div className="group"> <input type="submit" className="button" value="Sign In" /> </div>
                                        <div className="hr"></div>
                                        {/* if user is click this, sign up form shown, user need put an email there and the user will receive a new password to email */}
                                        {/* This process happens both when the user forgets a password and when he registers for the first time */}
                                        <div className="foot" onClick={() => { setButtonValue("Send new Password") }}> <label htmlFor="tab-2">Forgot Password?</label> </div>
                                        <p className="message"> {message} </p>
                                    </div>
                                </form>
                                {/* //Sign up page design */}
                                <form onSubmit={SignUp}>
                                    <div className="sign-up-form">
                                        <div className="group"> <label htmlFor="user" className="label">Username</label> <input id="user" type="text" className="input" placeholder="Use the given user name from Admin" onChange={(e) => { setNewUser({ ...newUser, username: e.target.value }); setMessage("") }} /> </div>
                                        <div className="group"> <label htmlFor="email" className="label">Email Address</label> <input id="email" type="email" className="input" data-type="Email" placeholder="Email Address" onChange={(e) => { setNewUser({ ...newUser, email: e.target.value }) }} /> </div>
                                        <div className="group"> <input type="submit" className="button" value={button} /> </div>
                                        <div className="hr"></div>
                                        <div className="foot"> <label htmlFor="tab-1">Already Member?</label> </div>
                                        <p className="message"> {message} </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Login;