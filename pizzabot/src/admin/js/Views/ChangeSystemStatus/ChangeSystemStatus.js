import React from 'react';

// Redux
import { connect } from 'react-redux';
import {
    changeVisibilityOfLoadingPanel
} from 'js/Redux/actions';

// Dx
import {
    Button
} from 'devextreme-react';

// global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';

class ChangeSystemStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: '',
            lastAction: null,
        }

        this.handleChangeStatusOfTheSystem = this.handleChangeStatusOfTheSystem.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const {
            dispatch
        } = this.props;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/point/get_system_status',
            {
                address: 'Плеханова 58а',
            },
            (response) => {
                if (response && response.Status) {
                    this.setState({
                        mode: response.Status,
                    });
                    dispatch(changeVisibilityOfLoadingPanel(true));
                    globalFuncs.sendRequest(
                        'POST',
                        '/operator/action_history',
                        {
                            operationtype: globalConsts.operationTypes.sysStatus,
                            last_action: true,
                        },
                        (response) => {
                            if (response && response.Operations && response.Operations.length > 0) {
                                var lastAction = response.Operations[0];
                                this.setState({
                                    lastAction,
                                })
                            }
                            dispatch(changeVisibilityOfLoadingPanel(false));
                        },
                        (response) => {
                            dispatch(changeVisibilityOfLoadingPanel(false));
                        }
                    )
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        );
    }

    handleChangeStatusOfTheSystem() {

    }

    render() {
        const {
            mode,
            lastAction,
        } = this.state;

        if (lastAction) {
            var data = JSON.parse(lastAction.data);
            var date = new Date(lastAction.dateofoperation);
        }

        return (
            <> 
                <div className={'css_div'}>
                    <div className={'text-center mt-1 mb-4'}> 
                        <h3 className={'mb-3'}>Включение системы</h3>
                        <h5 className={'text-muted text-justify pl-2 pr-2'}>
                            Внимание! Перед запуском системы сделайте то, и это, и, разумеется еще и это. 
                            Внимание! Перед запуском системы сделайте то, и это, и, разумеется еще и это.
                        </h5>
                        {(mode === 'ON' || mode === 'ON AFTER CRITICAL ERROR') && 
                            <div className={'css_strt_bttn text-center'}>
                                <Button 
                                    onClick={this.handleChangeStatusOfTheSystem} 
                                    text={'Выключить систему'}
                                    height={'50px'}
                                    width={'80%'}
                                />
                            </div>
                        }
                        {mode === 'OFF' && 
                            <div className={'css_strt_bttn text-center'}>
                                <Button 
                                    onClick={this.handleChangeStatusOfTheSystem} 
                                    text={'Включить систему'}
                                    height={'50px'}
                                    width={'80%'}
                                />
                            </div>
                        }
                        {mode === 'OFF AFTER CRITICAL ERROR' &&
                            <div className={'css_strt_bttn text-center'}>
                                <Button 
                                    onClick={this.handleChangeStatusOfTheSystem} 
                                    text={'Полная проверка системы'}
                                    height={'50px'}
                                    width={'80%'}
                                />
                            </div>
                        } 
                    </div>
                    {lastAction &&
                        <div className={'css_history_div'}>
                            {data.prevMode === 'ON' &&
                                <h5 className={'pl-2'}>Включение системы</h5>
                            }
                            {data.prevMode === 'OFF' &&
                                <h5 className={'pl-2'}>Выключение системы</h5>
                            }
                            {data.prevMode === 'ON AFTER CRITICAL ERROR' &&
                                <h5 className={'pl-2'}>Включение после критической ошибки</h5>
                            }
                            {data.prevMode === 'OFF AFTER CRITICAL ERROR' &&
                                <h5 vclassName={'pl-2'}>Выключение после критической ошибки</h5>
                            }
                            <div className={'mb-2 text-muted pl-4'} dangerouslySetInnerHTML={{__html: data.msg}} />
                            <label className={'pl-2'}>
                                {'Вызвано: ' + lastAction.operatorfi + ''} <br /> 
                                {'Дата: ' + date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </label>
                        </div>
                    }
                </div>
            </>
        )
    }
}

ChangeSystemStatus = connect(globalFuncs.mapStateToProps_global)(ChangeSystemStatus);
export default ChangeSystemStatus;