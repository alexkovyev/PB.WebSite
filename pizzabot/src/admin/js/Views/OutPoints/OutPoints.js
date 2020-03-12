import React from 'react';

// Redux
import { connect } from 'react-redux';

// global
import globalFuncs from 'js/globalFuncs';

class OutPoints extends React.Component {
    render() {
        return (
            <div>OutPoints</div>
        )
    }
}

OutPoints = connect(globalFuncs.mapStateToProps_global)(OutPoints);
export default OutPoints;
