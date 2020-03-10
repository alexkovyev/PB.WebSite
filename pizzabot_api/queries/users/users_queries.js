debuggerjs = require('../debugger');

//#region Check access user

function signIn(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_SignInUser', params);
    dbInstance.any(
        'SELECT * FROM FN_SignInUser(${login}, ${pwd})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

//#endregion

//#region Update user

function updateUser(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_Users_IU', params);
    dbInstance.any(
        'select * from FN_Users_IU(${refid}, ${userfn}, ${usersn}, ${userln}, ${useremail}, ${userphone}, ${userpwd}, ${usernewpwd}, ${execby}, ${type})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    })
}

//#endregion

module.exports = {
    signIn,
    updateUser
}