import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { connect } from 'react-redux';
import {
    changeVisibilityOfLoadingPanel,
    goToPage,
} from 'js/Redux/actions';

// Dx
import {
    SelectBox, 
    Button,
    List
} from 'devextreme-react';
import {
    Popup
} from 'devextreme-react/popup';
import { custom } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';

// global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';

class LoadSTFF extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            actionType: 'load',

            loadSTFF: {},
            unloadSTFF: {},
            loadContainer: {},

            stffForLoad: null,

            fridgeMap: [],
            stffs: [],
            containerInfoPopupVisible: false,
            containerInfoPopupData: {
                name: [],
                data: {},
            },
            stffCellCode: '',
        }

        this.showConfirmationMsg = (messageHtml, title) => {
            return custom({
                title: title,
                messageHtml: messageHtml,
                buttons: [
                    {
                        text: 'Да',
                        onClick: (e) => {
                            return true;
                        }
                    },
                    {
                        text: 'Нет',
                        onClick: (e) => {
                            return false;
                        }
                    }
                ]
            }).show();
        }
        
        this.collectionOfNamesForContainer = [
            'A1',
            'A2',
            'A3',
            'A4',
            'A5',
            'A6',
            'A7',
            'B1',
            'B2',
            'B3',
            'B4',
            'B5',
            'B6',
            'B7',
            'C1',
            'C2',
            'C3',
            'C4',
            'C5',
            'C6',
            'C7',
            'D1',
            'D2',
            'D3',
            'D4',
            'D5',
            'D6',
            'D7',
        ];

        this.handleLoadSTFF = this.handleLoadSTFF.bind(this);
        this.handleChangeActionType = this.handleChangeActionType.bind(this);
        this.handleMakeMvmntInThisContainer = this.handleMakeMvmntInThisContainer.bind(this);
        this.handleHidingPopup = this.handleHidingPopup.bind(this);
        this.handleChooseCellForLoad = this.handleChooseCellForLoad.bind(this);
        this.handleAddStffToCell = this.handleAddStffToCell.bind(this);
        this.handleLoadContainer = this.handleLoadContainer.bind(this);
        this.handleChangeStffForCell = this.handleChangeStffForCell.bind(this);
    }

    componentDidMount() {
        const {
            dispatch
        } = this.props;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/stffs/get_fridge_map',
            {
                // point_refid
            },
            (response) => {
                if (response && response.FridgeMap) {
                    this.setState({
                        fridgeMap: response.FridgeMap,
                    })
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/stffs/get_all_stff',
            {
                //point_refid
            },
            (response) => {
                if (response && response.StffsByNames) {
                    this.setState({
                        stffs: response.StffsByNames,
                    })
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
    }

    sendHistoryOfUser() {
        const {
            dispatch,
            context
        } = this.props;

        const {
            loadSTFF,
            unloadSTFF
        } = this.state;

        var mvmntType = '';
        if (loadSTFF) {
            mvmntType += 'Загрузка/Выгрузка';
        } else if (unloadSTFF) {
            mvmntType += 'Выгрузка'
        }


        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/operator/add_history',
            {
                userrefid: context.User.RefID,
                actiontype: globalConsts.operationTypes.load_stff,
                actioncontent: JSON.stringify(
                    {
                        mvmntType
                    }
                )
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
    }

    handleLoadSTFF() {
        const {
            context, 
            dispatch 
        } = this.props;

        const {
            loadSTFF,
            unloadSTFF
        } = this.state;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/stffs/update_balance',
            {
                operatorfi: context.User.FirstName + ' ' + context.User.SecondName,
                loadSTFF,
                unloadSTFF
            },
            (response) => {
                if (!response || !response.isSuccess) {
                    notify("Что-то в обновлении полуфабрикатов пошло не так", "error", 1000);
                } else {
                    this.sendHistoryOfUser();
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
                dispatch(goToPage('ProductsMovements'));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
                notify("Что-то в обновлении полуфабрикатов пошло не так", "error", 1000);
            }
        )
    }

    handleHidingPopup() {
        this.setState({
            containerInfoPopupVisible: false,
            containerInfoPopupData: {
                name: [],
                data: {},
            },
            loadContainer: {},
        })
    }

    handleMakeMvmntInThisContainer(args) {
        var itemData = args.itemData;
        var key = itemData.codename[0];
        var {
            unloadSTFF,
            loadSTFF,
            actionType
        } = this.state;

        if (actionType === 'unload') {
            unloadSTFF[itemData.codename] = itemData.refid;
            this.setState(() => {
                unloadSTFF = Object.assign(
                    {},
                    unloadSTFF
                );
                return {
                    unloadSTFF
                }
            })
            return;
        }

        var showPopup = (withUnload) => {
            this.setState(() => {
                if (withUnload) {
                    unloadSTFF[itemData.codename] = itemData.refid;
                    unloadSTFF = Object.assign(
                        {},
                        unloadSTFF
                    );
                }

                var conName = itemData['codename'];
                var colOfNamesJson = {};
                for(var i in this.collectionOfNamesForContainer){
                    var name = this.collectionOfNamesForContainer[i];
                    var keyLocal = name[0];

                    if (!colOfNamesJson.hasOwnProperty(keyLocal)) {
                        colOfNamesJson[keyLocal] = [];
                    }
                    colOfNamesJson[keyLocal].push({
                        containerName: conName,
                        cellName: conName + '_' + name,
                    });
                }

                var colOfNamesArr = [];
                for(i in colOfNamesJson) {
                    colOfNamesArr.push({
                        key: i,
                        items: colOfNamesJson[i],
                    })
                }

                return {
                    unloadSTFF,
                    containerInfoPopupData: {
                        data: itemData,
                        names: colOfNamesArr
                    },
                    containerInfoPopupVisible: true
                }
            });
        }

        if (loadSTFF.hasOwnProperty(itemData.codename)) {
            this.showConfirmationMsg(
                `<i>Переписать изменения в ${itemData.codename} контейнере?</i>`, 
                'Изменения в контейнере'
            ).then((dialogResult) => {
                if (dialogResult) {
                    this.setState({
                        loadContainer: loadSTFF[itemData.codename],
                    })
                    showPopup(false);
                }
            })
        } else if (!unloadSTFF.hasOwnProperty(itemData.codename)){
            this.showConfirmationMsg(
                `<i>Перед загрузкой необходимо поставить контейнер на выгрзку. Выгрузить п/ф из контейнера ${itemData.codename}?</i>`, 
                'Изменения в контейнере'
            ).then((dialogResult) => {
                if (dialogResult) {
                    showPopup(true);
                }
            })
        } else {
            showPopup(false);
        }
    }

    handleChangeActionType(args) {
        this.setState({
            actionType: args.value,
        })
    }

    handleChooseCellForLoad(args) {
        this.setState((state) => {
            const {
                loadContainer
            } = state;

            if (loadContainer && loadContainer.hasOwnProperty(args.itemData.cellName)) {
                    return {
                        stffCellCode: args.itemData.cellName,
                        stffForLoad: loadContainer[args.itemData.cellName],
                    }
            }
            return {
                stffCellCode: args.itemData.cellName,
            }
        });
    }

    handleChangeStffForCell(args) {
        this.setState({
            stffForLoad: args.value,
        })
    }

    handleAddStffToCell() {
        this.setState((state) => {
            var {
                loadContainer,
                stffCellCode,
                stffForLoad,
            } = state;

            if (stffForLoad) {
                loadContainer[stffCellCode] = stffForLoad;
                loadContainer = Object.assign(
                    {},
                    loadContainer
                );
            }

            return {
                loadContainer,
                stffCellCode: '',
                stffForLoad: null,
            }
        })
    }

    handleLoadContainer() {
        this.setState((state) => {
            var {
                loadSTFF,
                containerInfoPopupData,
                loadContainer,
            } = state;

            var data = containerInfoPopupData.data;
            loadSTFF[data.codename] = loadContainer;
            loadSTFF = Object.assign(
                {},
                loadSTFF
            );

            return {
                loadSTFF,
                containerInfoPopupVisible: false,
                containerInfoPopupData: {
                    name: [],
                    data: {},
                },
                loadContainer: {},
            }
        })
    }

    render() {
        const {
            actionType,

            loadSTFF,
            unloadSTFF,

            containerInfoPopupVisible,
            containerInfoPopupData,

            fridgeMap,

            stffs,
            stffForLoad,

            stffCellCode,
            loadContainer,
        } = this.state;

        return (
            <> 
                <div className={'pstf_div'}>
                    <div className={'text-center mt-1 mb-2'}> 
                        <h3 className={'mb-3'}>Добавление данных</h3>
                        <SelectBox 
                            height={'40px'}
                            placeholder={'Выберите тип действия...'}
                            value={actionType}
                            dataSource={[
                                {key: 'Выгрузка п/ф', value: 'unload'},
                                {key: 'Загрузка п/ф', value: 'load'},
                            ]}
                            valueExpr={'value'}
                            displayExpr={'key'}
                            onValueChanged={this.handleChangeActionType}
                        />
                    </div>
                </div>
                <div className={'pstf_fridge_map'}>
                    <List 
                        dataSource={fridgeMap}
                        height={'100%'}
                        grouped={true}
                        collapsibleGroups={true}
                        focusStateEnabled={false}
                        hoverStateEnabled={false}
                        activeStateEnabled={false}
                        onItemClick={this.handleMakeMvmntInThisContainer}
                        groupRender={(args) => {
                            return (
                                <div style={{fontSize: '17px'}}>{'Линия п/ф: ' + args.key}</div>
                            )
                        }}
                        itemTemplate={(args, index, component) => {
                            var lineContainer = component.parentElement;
                            var container = lineContainer.parentElement;
                            if (container.className.indexOf('row') < 0) {
                                component.parentElement.parentElement.className += ' row';
                            }
                            if (lineContainer.className.indexOf('col-3') < 0) {
                                component.parentElement.className += ' col-3 mb-2 mt-2';
                            }
                            
                            return ReactDOM.render(
                                (
                                    <>
                                        <div className={'pstf_container_div text-center'}>
                                            <div className={'pstf_container_id_div ' + (
                                                loadSTFF.hasOwnProperty(args.codename) 
                                                    ? 'pstf_container_id_div_green'
                                                    : unloadSTFF.hasOwnProperty(args.codename) 
                                                        ? 'pstf_container_id_div_red'
                                                        : 'pstf_container_id_div_gray'
                                            )}> 
                                                <h4 className={'pstf_container_id'}>{args.codename}</h4>
                                            </div>
                                        </div>
                                    </>
                                ),
                                component
                            )
                        }}
                    />
                </div>
                <div className={'pstf_footer text-center mt-3'}>
                    <Button 
                        onClick={this.handleLoadSTFF} 
                        text={'Загрузка/выгрузка'}
                        height={'50px'}
                        width={'80%'}
                        disabled={(Object.keys(loadSTFF).length > 0 || Object.keys(unloadSTFF).length > 0) ? false : true}
                    />
                </div>
                <Popup
                    visible={containerInfoPopupVisible}
                    onHiding={this.handleHidingPopup}
                    dragEnabled={false}
                    closeOnOutsideClick={true}
                    showTitle={true}
                    title="Ячейки контейнера"
                    fullScreen={true}
                >
                    <div className={'pstf_ppp_container_map'}>
                        {stffCellCode && 
                            <>
                                <div className={'mb-2'}>
                                    <div className={'form-group text-left'}>
                                        <label>{`Ввести полуфабрикат для ячейки ${stffCellCode}`}</label>
                                        <div className={'mb-1'}>
                                            <SelectBox 
                                                dataSource={stffs}
                                                valueExpr={'refid'}
                                                displayExpr={'stffname'}
                                                value={stffForLoad}
                                                searchEnabled={true}
                                                placeholder={'Выберите ячейку п/ф...'}
                                                onValueChanged={this.handleChangeStffForCell}
                                            />
                                        </div>
                                        <div className={'pstf_footer text-center mt-2'}>
                                            <Button 
                                                height={'50px'}
                                                text={'Добавить полуфабрикат'}
                                                width={'80%'}
                                                onClick={this.handleAddStffToCell}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </>
                        }
                        {!stffCellCode &&
                            <div className={'pstf_footer text-center'}>
                                <Button 
                                    onClick={this.handleLoadContainer} 
                                    text={'Загрузить контейнер'}
                                    height={'50px'}
                                    width={'80%'}
                                />
                            </div>
                        }
                        <div className={'pstf_ppp_con'}>
                            <List 
                                dataSource={containerInfoPopupData.names}
                                height={'100%'}
                                grouped={true}
                                collapsibleGroups={true}
                                focusStateEnabled={false}
                                hoverStateEnabled={false}
                                activeStateEnabled={false}
                                onItemClick={this.handleChooseCellForLoad}
                                groupRender={(args) => {
                                    return (
                                        <div style={{fontSize: '17px'}}>{'Линия п/ф (Контейнер): ' + args.key}</div>
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
                                                <div className={'pstf_container_div text-center'}>
                                                    <div className={'pstf_container_id_div ' + (
                                                        loadContainer.hasOwnProperty(args.cellName) 
                                                            ? 'pstf_container_id_div_green' 
                                                            : 'pstf_container_id_div_gray'
                                                    )}> 
                                                        <h4 className={'pstf_container_id'}>{args.cellName}</h4>
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
                </Popup>
            </>
        )
    }
}

LoadSTFF = connect(globalFuncs.mapStateToProps_global)(LoadSTFF);
export default LoadSTFF;