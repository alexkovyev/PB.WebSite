debuggerjs = require('../debugger');

function stffsWithNames(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetAllStffsInSystem', params);
    dbInstance.any(
        'SELECT * FROM FN_GetAllStffsInSystem(${point_refid})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

function stffsWithCount(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetAllSTFFsStatus', params);
    dbInstance.any(
        'SELECT * FROM FN_GetAllSTFFsStatus(${point_refid})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

function fridgeMap(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GetFridgeMap', params);
    dbInstance.any(
        'SELECT * FROM FN_GetFridgeMap(${point_refid})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

function loadStff(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_LoadSTFF', params);
    dbInstance.any(
        'SELECT * FROM FN_LoadSTFF(${container_codename}, ${cell_codename}, ${stff_refid}, ${operatorfi})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

function unloadStff(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_UnloadSTFF', params);
    dbInstance.any(
        'SELECT * FROM FN_UnloadSTFF(${container_refid}, ${operatorfi})',
        params
    )
    .then(data => {
        successFunc(data);
    })
    .catch(err => {
        errorFunc(err);
    });
}

module.exports = {
    stffsWithNames,
    stffsWithCount,
    fridgeMap,
    loadStff,
    unloadStff,
}