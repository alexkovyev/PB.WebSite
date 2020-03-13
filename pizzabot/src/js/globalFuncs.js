import axios from 'axios';

var globalFuncs = {};

//#region JSON functions

globalFuncs.findValueInJson = (jsonData, key, displayExpr, valueExpr) => {
    for(var index in jsonData) {
        var data = jsonData[index];
        if (data[valueExpr] === key) {
            return data[displayExpr];
        }
    }

    return null;
}

//#endregion

//#region Server request

var processServiceResult = function(data, successFunction, errorFunction) {
    if (data) {
        data = data.data;
        if (data.Error) {
            console.log('Error in response');
            if (data.Error.text.toUpperCase() === 'SESSION EXPIRED'){
                // go to session expired page
            }

            if (errorFunction) {
                errorFunction(data.Error);
            }
        } else {
            if (successFunction) {
                successFunction(data);
            }
        }
    } else {
        console.log('Something went wrong with response');
    }
}

globalFuncs.sendRequest = function(type, methodName, JSONdata, successFunction, errorFunction, stringifyNeeded = false) {
    let body;
    if (stringifyNeeded) {
        body = JSONdata != null ? JSON.stringify(JSONdata) : null;
    } else {
        body = JSONdata;
    }

    switch(type){
        case 'POST': {
            axios.post(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body)
            .then(res => {
                processServiceResult(res, successFunction, errorFunction);
            })
            .catch(err => {
                if (!err.isAxiosError) {
                    processServiceResult(err.response, successFunction, errorFunction);
                }
            });
            break;
        }
        case 'PUT': {
            axios.put(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body)
            .then(res => {
                processServiceResult(res, successFunction, errorFunction);
            })
            .catch(err => {
                if (!err.isAxiosError) {
                    processServiceResult(err.response, successFunction, errorFunction);
                }
            });
            break;
        }
        case 'GET': {
            axios.get(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body)
            .then(res => {
                processServiceResult(res, successFunction, errorFunction);
            })
            .catch(err => {
                if (err.response.status === 401) {
                    errorFunction();
                }
                if (!err.isAxiosError) {
                    processServiceResult(err.response, successFunction, errorFunction);
                }
            });
            break;
        }
        case 'DELETE': {
            axios.delete(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body)
            .then(res => {
                processServiceResult(res, successFunction, errorFunction);
            })
            .catch(err => {
                if (!err.isAxiosError) {
                    processServiceResult(err.response, successFunction, errorFunction);
                }
            });
            break;
        }
        default: return;
    }
    
}

globalFuncs.sendRequestAwait = async function(type, methodName, JSONdata, successFunction, errorFunction, stringifyNeeded = false) {
    let body;
    if (stringifyNeeded) {
        body = JSONdata != null ? JSON.stringify(JSONdata) : null;
    } else {
        body = JSONdata;
    }

    let res = null;
    switch(type){
        case 'POST': {
            res = await axios.post(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body);
            break;
        }
        case 'PUT': {
            res = await axios.put(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body)
            break;
        }
        case 'GET': {
            res = await axios.get(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body)
            break;
        }
        case 'DELETE': {
            res = await axios.delete(`http://${process.env.IP}${process.env.NODE_ENV === 'development-3000' ? ':4000' : ':2093'}/api${methodName}`, body)
            break;
        }
        default: break;
    }

    if (res) {
        if (typeof (res.isAxiosError) === 'undefined') {
            processServiceResult(res, successFunction, errorFunction);
        } else if (!res.isAxiosError) {
            processServiceResult(res.response, successFunction, errorFunction);
        }
    }
}

//#endregion

//#region Tokens

globalFuncs.getToken = function() {
    return sessionStorage.getItem('token') || null;
}

globalFuncs.removeUserSession = function() {
    sessionStorage.removeItem('token');
}

globalFuncs.setUserSession = function(token) {
    sessionStorage.setItem('token', token);
}

//#endregion

//#region Redux global functions

globalFuncs.mapStateToProps_global = function(state) {
    const {
        dataForPage,
        visibilityOfLoadingPanel,
        initializedContext,
        error
    } = state;

    return {
        isLoading: visibilityOfLoadingPanel.isLoading,
        context: initializedContext,
        dataForPage,
        error
    }
}

//#endregion

export default globalFuncs