debuggerjs = require('../debugger');

//#region System status

function systemStatus(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetStatusOfPoint', params);
    dbInstance.any(
        'SELECT * FROM FN_GetStatusOfPoint(${address})',
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
}