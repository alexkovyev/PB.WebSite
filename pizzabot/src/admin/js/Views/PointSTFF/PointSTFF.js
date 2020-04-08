import React from 'react';

// Redux
import { connect } from 'react-redux';
import {
    changeVisibilityOfLoadingPanel,
    goToPage,
} from 'js/Redux/actions';

// Dx 
import { 
    Button,
    List,
} from 'devextreme-react';

// Local
import PointSTFFHistoryLine from './PointSTFFHistoryLine';

// global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';
import moment from 'moment';

class PointSTFF extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastActions: null,
        }

        this.handleAddSTFFMovement = this.handleAddSTFFMovement.bind(this);
    }

    componentDidMount() {
        this.loadHistoryOfSTFF();
    }

    loadHistoryOfSTFF() {
        const {
            dispatch
        } = this.props;
        dispatch(changeVisibilityOfLoadingPanel(true));

        globalFuncs.sendRequest(
            'POST',
            '/operator/action_history',
            {
                operationtype: globalConsts.operationTypes.load_stff,
                datefrom: moment.utc().set({ 'hours': 0, 'minute': 0, 'second': 0 }),
                dateto: moment.utc().set({ 'hours': 23, 'minute': 59, 'second': 59 }),
            },
            (response) => {
                if (response && response.Operations) {
                    this.setState((state) => {
                        var { 
                            lastActions
                        } = state;
                        lastActions = Object.assign(
                            [],
                            lastActions,
                            response.Operations,
                        );
                        return {
                            lastActions
                        }
                    });
                    dispatch(changeVisibilityOfLoadingPanel(false));
                }
            },
            () => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
    }

    handleAddSTFFMovement() {
        const {
            dispatch
        } = this.props;

        dispatch(goToPage('LoadProducts'));
    }

    render() {
        const {
            lastActions,
        } = this.state;

        return (
            <> 
                <div className={'pstf_div'}>
                    <div className={'text-center mt-1 mb-4'}> 
                        <h3 className={'mb-3'}>Данные о запасах</h3>
                        <div className={'pstf_strt_bttn text-center'}>
                            <Button 
                                onClick={this.handleAddSTFFMovement} 
                                text={'Добавить данные'}
                                height={'50px'}
                                width={'80%'}
                            />
                        </div>
                    </div>
                    <div className={'pl-2 pr-2'}>
                        {lastActions &&
                            <h5 className={'text-left'}>Последние действия</h5>
                        }
                        <List 
                            dataSource={lastActions}
                            noDataText={'Движение полуфабрикатов в кафе не производились'}
                            height={'100%'}
                            focusStateEnabled={false}
                            hoverStateEnabled={false}
                            activeStateEnabled={false}
                            itemRender={(e) => {
                                return (
                                    <PointSTFFHistoryLine 
                                        execBy={e.operatorfi}
                                        actionTypeData={e.data}
                                        date={new Date(e.dateofoperation)}
                                    />
                                )
                            }}
                        />
                    </div>
                </div>
            </>
        )
    }
}

PointSTFF = connect(globalFuncs.mapStateToProps_global)(PointSTFF);
export default PointSTFF;