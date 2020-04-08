debuggerjs = require('../debugger');

//#region System status

function systemStatus(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetStatusOfPoint', params);
    dbInstance.any(
        'SELECT * FROM FN_GetStatusOfPoint(${address}, ${userprofilerefid})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

function systemStatistics(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetPointStatistics', params);
    dbInstance.any(
        'SELECT * FROM FN_GetPointStatistics(${point_refid})',
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


//#region Orders

function allOrdersOfPoint(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetAllOrdersOfPoint', params);
    dbInstance.any(
        'SELECT * FROM FN_GetAllOrdersOfPoint(${point_refid})',
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
    systemStatus,
    allOrdersOfPoint,
    systemStatistics
}