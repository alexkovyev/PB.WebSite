import React from 'react';

// Redux
import { connect } from 'react-redux';

// global
import globalFuncs from 'js/globalFuncs';

class ChangeSystemStatus extends React.Component {
    render() {
        return (
            <h1>ChangeSystemStatus</h1>
        )
    }
}

ChangeSystemStatus = connect(globalFuncs.mapStateToProps_global)(ChangeSystemStatus);
export default ChangeSystemStatus;