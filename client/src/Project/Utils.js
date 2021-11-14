//A file for the functions that need to be repeated in other files

//A function that return the current date
const GetDate = () => {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; // Get the month as a number (0-11) => the real month is getMonth() + 1
}

//A function that creates a new array of permissions according to the CheckBox
const CreatePermissions = (e, permission, newPermissions) => {
    let index = newPermissions.indexOf(permission)
    e.target.checked ? newPermissions.push(permission) : newPermissions.splice(index, 1)
    return newPermissions
}

//A function that checks whether the user has permission to perform this operation
const CheckPermission = (permission, permissions) => {
    if (permissions.includes(permission)) return true
    else alert("Sorry, this permission is not available to you")
}

export default { GetDate, CreatePermissions, CheckPermission }