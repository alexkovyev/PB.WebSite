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
const operator_qq = require('./operator/operator_queries');
const general_qq = require('./general/general_queries');
const cntrls_qq = require('./cntrls/cntrls_queries');
const points_qq = require('./points/points_queries');
const docs_gen_qq = require('./generate_docs/generation_docs_queries');
const stff_qq = require('./stffs/stffs_queries');

//#endregion

function get_data(actName, params, successFunc, errorFunc) {
    if (!actName || !successFunc) return;
}

function post_data(actName, params, successFunc, errorFunc) {
    if (!actName || !successFunc) return;

    if (actName === 'post_context_for_user') {
        users_qq.signIn(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_new_user_info') {
        users_qq.updateUser(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_operator_action_history') {
        operator_qq.operatorActions(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_type_codes') {
        general_qq.typeCodes(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_add_new_action') {
        operator_qq.putOperatorActions(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_cntrls_points') {
        cntrls_qq.cntrlsPoint(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_upd_cntrl') {
        cntrls_qq.cntrlsPointUpd(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_system_status') {
        points_qq.systemStatus(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_operators_by_point') {
        operator_qq.getAllOperatorByPoint(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_generated_doc_for_washing') {
        docs_gen_qq.docsForWashing(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_orders_in_today') {
        points_qq.allOrdersOfPoint(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_point_statistics') {
        points_qq.systemStatistics(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_stffs_count') {
        stff_qq.stffsWithCount(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_fridge_map') {
        stff_qq.fridgeMap(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_all_stffs') {
        stff_qq.stffsWithNames(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_load_container') {
        stff_qq.loadStff(db, params, successFunc, errorFunc);
    }

    if (actName === 'post_unload_container') {
        stff_qq.unloadStff(db, params, successFunc, errorFunc);
    }
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