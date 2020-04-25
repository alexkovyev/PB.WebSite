import React from 'react';

// Redux
import { connect } from 'react-redux';
import {
    changeVisibilityOfLoadingPanel
} from 'js/Redux/actions';

// Dx 
import { 
    Button,
    SelectBox,
    List,
} from 'devextreme-react';

// Local
import WashingHistoryLine from './WashingHistoryLine';

// global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';
import moment from 'moment';

class WashingPoint extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastActions: null,
            mode: 'HistoryView',

            washingTypeSource: [],
            washingType: '',
            washingTypeValue: '',
        }

        this.handleStartWashing = this.handleStartWashing.bind(this);
        this.handleCancelWashing = this.handleCancelWashing.bind(this);
        this.handleSendWashingComand = this.handleSendWashingComand.bind(this);
        this.handleChangeWashingType = this.handleChangeWashingType.bind(this);
    }

    componentDidMount() {
        this.loadHistoryOfWashing();
    }

    loadHistoryOfWashing() {
        const {
            dispatch
        } = this.props;
        dispatch(changeVisibilityOfLoadingPanel(true));

        globalFuncs.sendRequest(
            'POST',
            '/operator/action_history',
            {
                operationtype: globalConsts.operationTypes.washing,
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

    handleStartWashing() {
        const {
            dispatch
        } = this.props;

        if (this.state.washingTypeSource.length < 1) {
            dispatch(changeVisibilityOfLoadingPanel(true));
            globalFuncs.sendRequest(
                'POST',
                '/general/typecodes',
                {
                    typename: 'WashingType'
                },
                (response) => {
                    if (response) {
                        this.setState({
                            washingTypeSource: response.typeCodeData,
                            mode: 'StartWashingMode'
                        });
                    }
                    dispatch(changeVisibilityOfLoadingPanel(false));
                },
                () => {
                    dispatch(changeVisibilityOfLoadingPanel(false));
                }
            )
            return;
        }
        
        this.setState({
            mode: 'StartWashingMode',
        });
    }

    handleCancelWashing() {
        this.setState({
            mode: 'HistoryView',
        });
    }

    handleSendWashingComand() {
        const {
            User
        } = this.props.context;

        const {
            dispatch
        } = this.props;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/operator/add_history',
            {
                userrefid: User.RefID,
                actiontype: globalConsts.operationTypes.washing,
                actioncontent: JSON.stringify({washingType: this.state.washingType})
            },
            (response) => {
                if (response && response.insertSuccess) {
                    this.setState({
                        mode: 'HistoryView',
                        washingType: '',
                        washingTypeValue: '',
                    });
                    this.loadHistoryOfWashing();
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            () => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
    }

    handleChangeWashingType(args) {
        this.setState({
            washingType: globalFuncs.findValueInJson(this.state.washingTypeSource, args.value, 'typedescription', 'typevalue'),
            washingTypeValue: args.value,
        });
    }

    render() {
        const {
            lastActions,
            mode,
            washingTypeSource,
            washingTypeValue
        } = this.state;

        return (
            <> 
                <div className={'wp_div'}>
                    <div className={'text-center mt-1 mb-4'}> 
                        <h3 className={'mb-3'}>Запустить мойку</h3>
                        <h5 className={'text-muted text-justify pl-2 pr-2'}>
                            Внимание! Перед запуском мойки сделайте то, и это, и, разумеется еще и это. 
                            Внимание! Перед запуском мойки сделайте то, и это, и, разумеется еще и это.
                        </h5>
                        {mode === 'HistoryView' && 
                            <div className={'wp_strt_bttn text-center'}>
                                <Button 
                                    onClick={this.handleStartWashing} 
                                    text={'Запустить мойку'}
                                    height={'50px'}
                                    width={'80%'}
                                />
                            </div>
                        }
                        {mode === 'StartWashingMode' && 
                            <div className={'wp_strt_bttn text-center'}>
                                <Button 
                                    onClick={this.handleCancelWashing} 
                                    text={'Отменить мойку'}
                                    height={'50px'}
                                    width={'80%'}
                                />
                            </div>
                        }
                    </div>
                    {mode === 'HistoryView' && 
                        <div className={'pl-2 pr-2'}>
                            {lastActions &&
                                <h5 className={'text-left'}>Последние действия</h5>
                            }
                            <List 
                                dataSource={lastActions}
                                noDataText={'Мойка в кафе не производилась'}
                                height={'100%'}
                                focusStateEnabled={false}
                                hoverStateEnabled={false}
                                activeStateEnabled={false}
                                itemRender={(e) => {
                                    return (
                                        <WashingHistoryLine 
                                            execBy={e.operatorfi}
                                            actionTypeData={e.data}
                                            date={new Date(e.dateofoperation)}
                                        />
                                    )
                                }}
                            />
                        </div>
                    }
                    {mode === 'StartWashingMode' && 
                        <> 
                            <hr />
                            <div>
                                <div className={'text-center mb-3'}>
                                    <SelectBox 
                                        onValueChanged={this.handleChangeWashingType}
                                        value={washingTypeValue}
                                        dataSource={washingTypeSource}
                                        displayExpr={'typedescription'}
                                        valueExpr={'typevalue'}
                                        height={'50px'}
                                        placeholder={'Выберите тип мойки...'}
                                    />
                                </div>
                                <div className={'wp_strt_bttn text-center'}>
                                    <Button 
                                        onClick={this.handleSendWashingComand} 
                                        text={'Запустить мойку'}
                                        height={'50px'}
                                        width={'80%'}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </div>
            </>
        )
    }
}

WashingPoint = connect(globalFuncs.mapStateToProps_global)(WashingPoint);
export default WashingPoint;