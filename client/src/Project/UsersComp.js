import React, { useState } from 'react';
import util from './Utils';

const UsersComp = (props) => {
    const [visibilty, setVisibilty] = useState({ edit: "none", users: "block" })
    const [newUser, setNewUser] = useState({ fname: props.data.FirstName, lname: props.data.LastName, userName: props.login.UserName, sessionTimeout: props.data.SessionTimeOut, })
    const [newPermissions, setNewPermissions] = useState(props.permissions.Permissions)
    const [passport, setPassport] = useState("")


    // A function that checks what permissions the user has and marks the checkbox accordingly
    const CheckPermissions = (str) => {
        let answer;
        props.permissions.Permissions.includes(str) ? answer = true : answer = false
        return answer
    }

    let permissions = props.permissions.Permissions.map((permission, index) => { //permissions => { id , [array of strings(permissions)]} , permissions.Permissions => [array of strings(permissions)]
        return <li key={index} className="margin-left" >{permission}</li>
    })
    let buttonVisibilty;
    props.login.Admin ? buttonVisibilty = "none" : buttonVisibilty = "block"  //if the user is the admin it is not possible to edit or delete him

    return (
        <div>
            {/* Users "Page" */}
            <div className={visibilty.users}>
                <div className="border">
                    <div className="flex">
                        <div>
                            Name : {props.data.FirstName} {props.data.LastName} <br />
                            User Name : {props.login.UserName} <br />
                            Session Time Out : {props.data.SessionTimeOut} Minutes <br />
                            Created Date : {props.data.CreatedDate} <br />
                            Permissions: <ul > {permissions}  </ul> <br />

                            <div className={buttonVisibilty}>
                                <input type="button" value="Edit" onClick={() => { setVisibilty({ edit: "block", users: "none" }) }} />
                                <input type="button" value="Delete" onClick={() => { props.resp(["delete", props.login._id]) }} />
                            </div>
                        </div>
                        <div className="download">
                            <img className="size" src={props.data.Passport}></img>
                        </div>
                    </div>
                </div>
            </div>


            {/* Edit Page */}
            <div className={visibilty.edit}>
                <div className="border">
                    First Name : <input placeholder={props.data.FirstName} onChange={(e) => { setNewUser({ ...newUser, fname: e.target.value }) }} /> <br />
                    Last Name :  <input placeholder={props.data.LastName} onChange={(e) => { setNewUser({ ...newUser, lname: e.target.value }) }} /> <br />
                    User Name: <input placeholder={props.login.UserName} onChange={(e) => { setNewUser({ ...newUser, userName: e.target.value }) }} /> <br />
                    Url Picture :  <input placeholder="url" onChange={(e) => { setPassport(e.target.value) }} /> <br />
                    Session Time Out : <input placeholder={`${props.data.SessionTimeOut} Minutes`} onChange={(e) => { setNewUser({ ...newUser, sessionTimeout: e.target.value }) }} /><br />
                    Created Date : {props.data.CreatedDate} <br />


                    <div className="flex">
                        <div>
                            {/* Minimum permission */}
                            <input type="checkbox" checked={true} readOnly />  View Subscriptions <br />
                            {/* Optional permission */}
                            <input type="checkbox" defaultChecked={CheckPermissions("Create Subscriptions")} onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Create Subscriptions", newPermissions)) }} /> Create Subscriptions <br />
                            <input type="checkbox" defaultChecked={CheckPermissions("Delete Subscriptions")} onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Delete Subscriptions", newPermissions)) }} /> Delete Subscriptions <br />
                            <input type="checkbox" defaultChecked={CheckPermissions("Update Subscriptions")} onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Update Subscriptions", newPermissions)) }} /> Update Subscriptions <br />
                        </div>

                        <div className="margin-left">
                            {/* Minimum permission */}
                            <input type="checkbox" checked={true} readOnly /> View Movies <br />
                            {/* Optional permission */}
                            <input type="checkbox" defaultChecked={CheckPermissions("Create Movies")} onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Create Movies", newPermissions)) }} /> Create Movies <br />
                            <input type="checkbox" defaultChecked={CheckPermissions("Delete Movies")} onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Delete Movies", newPermissions)) }} /> Delete Movies <br />
                            <input type="checkbox" defaultChecked={CheckPermissions("Update Movies")} onChange={(e) => { setNewPermissions(util.CreatePermissions(e, "Update Movies", newPermissions)) }} />  Update Movies <br /><br />
                        </div>
                    </div>

                    <input type="button" value="Update" onClick={() => {
                        setVisibilty({ edit: "none", users: "block" });
                        props.resp([props.login._id, [{ UserName: newUser.userName, Password: props.login.Password, Email: props.login.Email }, //Send an array to main page with callback  => [0] = id , [1] = new user for update
                        { FirstName: newUser.fname, LastName: newUser.lname, CreatedDate: props.data.CreatedDate, SessionTimeOut: parseInt(newUser.sessionTimeout), Passport: passport },
                        { Permissions: newPermissions }
                        ]]);
                    }} />
                    <input type="button" value="Cancel" onClick={() => {
                        setVisibilty({ edit: "none", users: "block" })
                    }} />
                </div>
            </div>
        </div >
    );
};



export default UsersComp;