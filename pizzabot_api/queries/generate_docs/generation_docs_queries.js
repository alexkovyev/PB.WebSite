debuggerjs = require('../debugger');

function docsForWashing(dbInstance, params, successFunc, errorFunc) {
    debuggerjs.get_query('FN_GenDocWashing_S', params);
    dbInstance.any(
        'SELECT * FROM FN_GenDocWashing_S(${userrefid}, ${datefrom}, ${dateto}, ${type})',
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
    docsForWashing,
}