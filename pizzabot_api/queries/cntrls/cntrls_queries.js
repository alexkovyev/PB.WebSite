debuggerjs = require('../debugger');

//#region Cntrls select

function cntrlsPoint(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetPoints', params);
    dbInstance.any(
        'SELECT * FROM FN_GetPoints(${cntrlsname}, ${userprofilerefid})',
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

//#region Cntrl upd

function cntrlsPointUpd(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_UpdPoints', params);
    dbInstance.any(
        'SELECT * FROM FN_UpdPoints(${cntrlsname}, ${point_id}, ${enabled}, ${execby}, ${userprofilerefid})',
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

module.exports = {
    cntrlsPoint,
    cntrlsPointUpd,
}