const promise = require('bluebird');

const initOptions = {
    promiseLib: promise,
};

const pgp = require('pg-promise')(initOptions);

const monitor = require('pg-monitor');

monitor.attach(initOptions);
monitor.setTheme('matrix');

monitor.setLog((msg, info) => {
    // can save log into file
});

const configConnection = {
    host: '46.146.234.141',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'passVVord#',
}

// database instance
const db = pgp(configConnection);

//#region Import queries files

const users_qq = require('./users/users_queries');

//#endregion

function get_data(actName, params, successFunc, errorFunc) {
    if (!actName || !successFunc) return;
}

function post_data(actName, params, successFunc, errorFunc) {
    if (!actName || !successFunc) return;

    //#region users_qq

    if (actName === 'post_context_for_user') {
        users_qq.signIn(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_new_user_info') {
        users_qq.updateUser(db, params, successFunc, errorFunc);
    }

    //#endregion
}

function put_data(actName, params, successFunc, errorFunc) {
    if (!actName || !successFunc) return;
}

function delete_data(actName, params, successFunc, errorFunc) {
    if (!actName || !successFunc) return;
}

module.exports = {
    get_data,
    post_data, 
    put_data,
    delete_data
}