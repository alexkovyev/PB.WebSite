import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { connect } from 'react-redux';
import {
    changeVisibilityOfLoadingPanel
} from 'js/Redux/actions';

// Dx
import {
    List
} from 'devextreme-react';

// global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';

class OvenPoints extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ovenpointsbyControl: null,
        }

        this.handleChangeEnabledOvenPoint = this.handleChangeEnabledOvenPoint.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const {
            dispatch,
            context
        } = this.props;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/cntrls/get_points',
            {
                cntrlsname: globalConsts.cntrlsType.ovenpoints,
                userprofilerefid: context.User.Profile.RefID,
            },
            (response) => {
                if (response && response.Cntrls) {
                    this.setState({
                        ovenpointsbyControl: response.Cntrls,
                    })
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        );
    }

    handleChangeEnabledOvenPoint(args) {
        const {
            dispatch,
            context
        } = this.props;
        var itemData = args.itemData;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/cntrls/upd_points',
            {
                cntrlsname: globalConsts.cntrlsType.ovenpoints,
                point_id: itemData.id,
                enabled: !itemData.enabled,
                execby: context.User.FirstName + ' ' + context.User.SecondName,
                userprofilerefid: context.User.Profile.RefID,
            },
            (response) => {
                if (response && response.isSuccess) {
                    this.setState((state) => {
                        var {
                            ovenpointsbyControl
                        } = state;
                        
                        var cntrlByKey;
                        for(var i in ovenpointsbyControl) {
                            if (ovenpointsbyControl[i].key === itemData.key) {
                                cntrlByKey = ovenpointsbyControl[i].items;
                                break;
                            }
                        };
                       
                        for(i in cntrlByKey) {
                            if (cntrlByKey[i].id === itemData.id) {
                                cntrlByKey[i].enabled = !cntrlByKey[i].enabled;
                                break;
                            }
                        }

                        for(i in ovenpointsbyControl) {
                            if (ovenpointsbyControl[i].key === itemData.key) {
                                ovenpointsbyControl[i].items = cntrlByKey;
                            }
                        }

                        ovenpointsbyControl = Object.assign([], ovenpointsbyControl);
                        return {
                            ovenpointsbyControl
                        }
                    });
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
    }

    render() {
        const {
            ovenpointsbyControl
        } = this.state;

        return (
            <>
                <div className={'op_div'}>
                    <div className={'text-center mt-1 mb-4'}> 
                        <h3 className={'mb-3'}>Ячейки печи</h3>
                    </div>
                    <div>
                        <List 
                            dataSource={ovenpointsbyControl}
                            height={'100%'}
                            grouped={true}
                            collapsibleGroups={true}
                            focusStateEnabled={false}
                            hoverStateEnabled={false}
                            activeStateEnabled={false}
                            onItemClick={this.handleChangeEnabledOvenPoint}
                            groupRender={(args) => {
                                return (
                                    <div style={{fontSize: '17px'}}>{args.key}</div>
                                )
                            }}
                            itemTemplate={(args, index, component) => {
                                var lineContainer = component.parentElement;
                                var container = lineContainer.parentElement;
                                if (container.className.indexOf('row') < 0) {
                                    component.parentElement.parentElement.className += ' row';
                                }
                                if (lineContainer.className.indexOf('col-4') < 0) {
                                    component.parentElement.className += ' col-4 mb-2 mt-2';
                                }
                                
                                return ReactDOM.render(
                                    (
                                        <>
                                            <div className={'op_cntrl_div text-center'}>
                                                <div className={'op_cntrl_id_div'}> 
                                                    <h4 className={'op_cntrl_id'}>{args.id}</h4>
                                                </div>
                                                <div className={'row pt-1'}>
                                                    <label className={'op_cntrl_status col-12 mb-0'}>
                                                        {args.enabled ? 'Работает' : 'Не работает'}
                                                    </label>
                                                    <label className={'text-muted col-12'}>
                                                         {args.enabled ? 'Выключить' : 'Включить'}
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    ),
                                    component
                                )
                            }}
                        />
                    </div>
                </div>
            </>
        )
    }
}

OvenPoints = connect(globalFuncs.mapStateToProps_global)(OvenPoints);
export default OvenPoints;
