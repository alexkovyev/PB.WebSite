import React from 'react';

// Redux
import { connect } from 'react-redux';
import {
    changeVisibilityOfLoadingPanel
} from 'js/Redux/actions';

// Dx
import {
    DataGrid
} from 'devextreme-react';
import {
    Column
} from 'devextreme-react/data-grid';
import DataSource from 'devextreme/data/data_source';

// global
import globalFuncs from 'js/globalFuncs';

class MainInfoPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numberOfOrdersNow: 0,
            numberOfAllOrdersToday: 0,
            numberOfErrors: 0,
            numberOfDishesAreUnavailable: 0,

            stffs: [],
        }
    }

    componentDidMount() {
        const {
            dispatch
        } = this.props;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/point/get_system_statistics',
            {
                //point_refid
            },
            (response) => {
                if (response) {
                    var numberOfOrdersNow = 0;
                    var numberOfAllOrdersToday = 0;
                    var numberOfDishesAreUnavailable = 0
                    var numberOfErrors = 0;

                    if (response.OrdersNow) {
                        numberOfOrdersNow = response.OrdersNow;
                    }
                    if (response.OrdersToday) {
                        numberOfAllOrdersToday = response.OrdersToday;
                    }
                    if (response.CountOfUnavailableDishes) {
                        numberOfDishesAreUnavailable = response.CountOfUnavailableDishes;
                    }
                    if (response.CountOfErrors) {
                        numberOfErrors = response.CountOfErrors;
                    }

                    this.setState({
                        numberOfAllOrdersToday,
                        numberOfOrdersNow,
                        numberOfErrors,
                        numberOfDishesAreUnavailable
                    });
                    this.loadSTFFData();
                }
            },
            (reponse) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
    }

    parseToDateSourse(dataSource) {
        return new DataSource({
            loadMode: "raw",
            pageSize: 10,
            paginate: true,
            store: {
                type: "array",
                data: dataSource
            }
        });
    }
 
    loadSTFFData() {
        const {
            dispatch
        } = this.props;

        globalFuncs.sendRequest(
            'POST',
            '/stffs/get_count_of_stffs',
            {
                //point_refid
            },
            (response) => {
                if (response && response.STFFCount) {
                    this.setState({
                        stffs: this.parseToDateSourse(response.STFFCount),
                    })
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
            numberOfAllOrdersToday,
            numberOfOrdersNow,
            numberOfDishesAreUnavailable,
            numberOfErrors,

            stffs,
        } = this.state;

        return (
            <> 
                <div className={'mip_div mt-2'}>
                    <div className={'row text-center mb-4'}> 
                        <div className={'col-6'}>
                            <h5 className={'text-muted'}>Заказов в работе</h5>
                            <div className={'font-weight-bold'} style={{fontSize: '25px'}}>
                                {numberOfOrdersNow}
                            </div>
                        </div>
                        <div className={'col-6'}>
                            <h5 className={'text-muted'}>Заказов за день</h5>
                            <div className={'font-weight-bold'} style={{fontSize: '25px'}}>
                                {numberOfAllOrdersToday}
                            </div>
                        </div>
                    </div>
                    <div className={'row mb-2'}>
                        <div className={'col-5 text-right'}>
                            <div className={'rounded-circle round-right ' + (numberOfDishesAreUnavailable > 0 ? 'round-red' : 'round-green')}></div>
                        </div>
                        <div className={'col-7'}>
                            <h5 className={'mb-1'}>Меню</h5>
                            <label>
                                {numberOfDishesAreUnavailable > 0 ? `В продаже нет ${numberOfDishesAreUnavailable} блюд` : 'Все блюда в продаже'}
                            </label>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-5'}>
                            <div className={'rounded-circle round-right ' + (numberOfErrors > 0 ? 'round-red' : 'round-green')}></div>
                        </div>
                        <div className={'col-7'}>
                            <h5 className={'mb-1'}>Сбои в работе</h5>
                            <label>
                                {numberOfErrors > 0 ? `Найдено ${numberOfErrors} ошибки` : 'Киоск работает исправно'}
                            </label>
                        </div>
                    </div>
                    <hr />
                    <div className={'text-center'}>
                        <h5 className={'text-muted'}>Скоро закончатся</h5>
                        <DataGrid
                            showColumnHeaders={false}
                            showBorders={true}
                            showColumnLines={false}
                            showRowLines={true}
                            width={'100%'}
                            defaultPager={{
                                showInfo: true,
                                showNavigationButtons: true,
                                visible: true,
                                customModeEnabled: true,
                            }}
                            noDataText="Полуфабрикатов нет в системе"
                            columnAutoWidth={true}
                            defaultScrolling={{
                                showScrollbar: "always"
                            }}
                            wordWrapEnabled={true}
                            loadPanel={{enabled: false}}
                            dataSource={stffs}
                        >
                            <Column 
                                caption={'Полуфабрикат'}
                                dataField={'stffname'}
                                allowHiding={false}
                                allowReordering={false}
                                visible={true}
                            />
                            <Column
                                caption={'Количество'}
                                dataField={'balance'}
                                allowHiding={false}
                                allowReordering={true}
                                visible={true}
                            />
                        </DataGrid>
                    </div>
                </div>
            </>
        )
    }
}

MainInfoPage = connect(globalFuncs.mapStateToProps_global)(MainInfoPage);
export default MainInfoPage;