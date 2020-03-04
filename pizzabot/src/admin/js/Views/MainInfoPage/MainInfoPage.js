import React from 'react';

// Redux
import { connect } from 'react-redux';

// global
import globalFuncs from 'js/globalFuncs';

class MainInfoPage extends React.Component {
    render() {
        return (
            <h1>MAIN PAGE</h1>
        )
    }
}

MainInfoPage = connect(globalFuncs.mapStateToProps_global)(MainInfoPage);
export default MainInfoPage;