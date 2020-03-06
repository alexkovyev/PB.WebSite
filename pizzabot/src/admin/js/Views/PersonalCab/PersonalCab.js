import React from 'react';
import { connect } from 'react-redux';

// global
import globalFuncs from 'js/globalFuncs';

class PersonalCab extends React.Component {
    constructor(props){
        super(props);

        this.state = {}
    }

    render() {
        return (
            <div>PersonalCab</div>
        )
    }
}

PersonalCab = connect(globalFuncs)(PersonalCab);
export default PersonalCab;

