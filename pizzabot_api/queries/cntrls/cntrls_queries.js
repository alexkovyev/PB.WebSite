debuggerjs = require('../debugger');

//#region Cntrls select

function cntrlsPoint(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetPoints', params);
    dbInstance.any(
        'SELECT * FROM FN_GetPoints(${cntrlsname})',
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

function cntrlsOutPointUpd(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_UpdOutPoints', params);
    dbInstance.any(
        'SELECT * FROM FN_UpdOutPoints(${cntrlsname}, ${point_id}, ${enabled}, ${execby})',
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
    cntrlsOutPointUpd,
}