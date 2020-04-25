import React from 'react';

// Redux
import { connect } from 'react-redux';

// Global
import globalFuncs from 'js/globalFuncs';

class DocForSells extends React.Component {
    render() {
        return (
            <div>DocForSells</div>
        )
    }
}

DocForSells = connect(globalFuncs.mapStateToProps_global)(DocForSells);
export default DocForSells;