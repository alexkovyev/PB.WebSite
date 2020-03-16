import React from 'react';

// Redux
import { connect } from 'react-redux';

// Global
import globalFuncs from 'js/globalFuncs';

class DocForSTFF extends React.Component {
    render() {
        return (
            <div>DocForSTFF</div>
        )
    }
}

DocForSTFF = connect(globalFuncs.mapStateToProps_global)(DocForSTFF);
export default DocForSTFF;