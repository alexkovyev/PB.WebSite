debuggerjs = require('../debugger');

//#region TypeCodes

function typeCodes(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_LoadTypeCodes', params);
    dbInstance.any(
        'SELECT * FROM FN_LoadTypeCodes(${typename})',
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
    typeCodes,
}