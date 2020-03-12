import React from 'react';

// Redux
import { connect } from 'react-redux';

// global
import globalFuncs from 'js/globalFuncs';

class WashingPoint extends React.Component {
    render() {
        return (
            <div>WashingPoint</div>
        )
    }
}

WashingPoint = connect(globalFuncs.mapStateToProps_global)(WashingPoint);
export default WashingPoint;