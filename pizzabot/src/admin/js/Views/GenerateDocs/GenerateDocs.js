import React from 'react';

// Redux
import { connect } from 'react-redux';

// global
import globalFuncs from 'js/globalFuncs';

class GenerateDocs extends React.Component {
    render() {
        return (
            <div>GenerateDocs</div>
        )
    }
}

GenerateDocs = connect(globalFuncs.mapStateToProps_global)(GenerateDocs);
export default GenerateDocs;