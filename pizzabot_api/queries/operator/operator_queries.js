debuggerjs = require('../debugger');

//#region History quieries

function operatorActions(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_LoadOperatorHistory', params);
    dbInstance.any(
        'SELECT * FROM FN_LoadOperatorHistory(${userrefid}, ${operationtype}, ${datefrom}, ${dateto}, ${is_return_json}, ${last_action})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

function putOperatorActions(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_OperatorHistory_I', params);
    dbInstance.any(
        'SELECT * FROM FN_OperatorHistory_I(${userrefid}, ${actiontype}, ${actioncontent}, ${is_content_json})',
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

//#region Select all

function getAllOperatorByPoint(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_Users_S', params);
    dbInstance.any(
        'SELECT * FROM FN_Users_S(${point_refid})',
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
    operatorActions,
    putOperatorActions,
    getAllOperatorByPoint
}