function get_query(procName, params) {
    console.group('====== DEBUGGER ======');
    console.log(
        `SELECT * FROM ${procName}`
    )
    console.group(
        '== PARAMS =='
    );
    console.dir(params);

    console.groupEnd();
    console.log();
    console.groupEnd();
    console.log();
}

module.exports = {
    get_query,
}