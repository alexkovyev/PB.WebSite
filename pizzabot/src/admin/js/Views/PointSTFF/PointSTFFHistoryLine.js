import React from 'react';
import PropTypes from 'prop-types';

class PointSTFFHistoryLine extends React.Component {
    render() {
        var {
            execBy,
            actionTypeData, 
            date
        } = this.props;

        actionTypeData = JSON.parse(actionTypeData);

        return (
            <div className={'pb-2 pt-1'}>
                <h5>{actionTypeData.mvmntType}</h5>
                <div className={'row'}>
                    <div className={'col-8 text-left'}>
                        {execBy}
                    </div>
                    <div className={'col-4 row text-right'}>
                        <div className={'col-12'}>
                            {date.toLocaleDateString()}
                        </div>
                        <div className={'col-12'}>
                            {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

PointSTFFHistoryLine.propTypes = {
    execBy: PropTypes.string.isRequired,
    actionTypeData: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
}

export default PointSTFFHistoryLine