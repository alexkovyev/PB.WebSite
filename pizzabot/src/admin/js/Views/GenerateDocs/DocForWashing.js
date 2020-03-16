import React from 'react';

// Redux
import { connect } from 'react-redux';
import {
    changeVisibilityOfLoadingPanel,
    goToPage,
} from 'js/Redux/actions';

// Dx
import {
    TagBox,
    SelectBox,
    DateBox,
    Button
} from 'devextreme-react';
import notify from 'devextreme/ui/notify';

// Global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';

class DocForWashing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            washingType: ['auto', 'operator'],
            operators: [],
            operatorForDoc: null,
            dateState: 'LH',
            dateFrom: globalFuncs.CalcStartDate('LH'),
            dateTo: globalFuncs.CalcEndDate('LH')
        }

        this.tagDataSource = [
            {key: 'Только автоматические', value: 'auto'},
            {key: 'Только ручные', value: 'operator'},
        ];

        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeOperator = this.handleChangeOperator.bind(this);
        this.handleChangeDateState = this.handleChangeDateState.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleGenerateDoc = this.handleGenerateDoc.bind(this);
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
            '/users/select_by_point',
            {},
            (response) => {
                if (response && response.Operators) {
                    this.setState({
                        operators: response.Operators,
                    })
                }
                dispatch(changeVisibilityOfLoadingPanel(false));
            }, 
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
    }

    handleChangeType(args) {
        this.setState({
            washingType: args.value
        });
    }

    handleChangeOperator(args) {
        this.setState({
            operatorForDoc: args.value,
        })
    }

    handleChangeDateState(args) {
        let newPeriod = args.value;
        let dateFrom = globalFuncs.CalcStartDate(newPeriod);
        let dateTo = globalFuncs.CalcEndDate(newPeriod);
        
        this.setState({
            dateState: newPeriod,
            dateFrom: dateFrom,
            dateTo: dateTo,
        })
    }

    handleChangeDate(args) {
        this.setState({
            dateState: 'CD',
            dateFrom: args.element.id === 'from' ? args.value : this.state.dateFrom,
            dateTo: args.element.id === 'to' ? args.value : this.state.dateTo
        })
    }

    handleGenerateDoc() {
        var {
            operatorForDoc,
            washingType,
            dateFrom,
            dateTo
        } = this.state;

        const {
            dispatch
        } = this.props;

        if (washingType.length === 2) {
            washingType = 'WASHING_ALL'
        } else { 
            if (washingType.indexOf('auto') >= 0) {
                washingType = 'WASHING_AUTO'
            } else {
                washingType = 'WASHING';
            }
        }

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/docs/generate/washing',
            {
                dateFrom,
                dateTo,
                userrefid: operatorForDoc,
                type: washingType
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
                dispatch(goToPage('GenerateDocs'));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
                notify("Something in generation was wrong", "error", 500);
            }
        )
    }

    render() {
        const {
            washingType,
            operators,
            operatorForDoc,
            dateState,
            dateFrom,
            dateTo
        } = this.state;

        return (
            <> 
                <div className={'dfw_div mb-3'} style={{fontSize: '17px'}}> 
                    <div className={'text-center mt-1 mb-4'}> 
                        <h3 className={'mb-3'}>Отчеты о мойке</h3>
                    </div>
                    <div className={'form-group row mb-2'}>
                        <label className={'col-12 col-form-label font-weight-bold'}>Типы моек для выгрузки</label>
                        <div className={'col-12'}>
                            <TagBox 
                                placeholder={'Выберите типы моек...'}
                                dataSource={this.tagDataSource}
                                onValueChanged={this.handleChangeType}
                                showSelectionControls={true}
                                value={washingType}
                                displayExpr={'key'}
                                valueExpr={'value'}
                            />
                        </div>
                    </div>
                    {washingType.indexOf('operator') >= 0 && 
                        <div className={'form-group row mb-2'}> 
                            <label className={'col-12 col-form-label font-weight-bold'}>Выбрать оператора</label>
                            <div className={'col-12'}>
                                <SelectBox 
                                    placeholder={'Выбрать оператора...'}
                                    dataSource={operators}
                                    displayExpr={'operatorfi'}
                                    valueExpr={'refid'}
                                    value={operatorForDoc}
                                    onValueChanged={this.handleChangeOperator}
                                />
                            </div>
                        </div>
                    }
                    <div className={'form-group row mb-2'}> 
                        <label className={'col-12 col-form-label font-weight-bold'}>Выбрать период</label>
                        <div className={'col-12'}>
                            <SelectBox 
                                placeholder={'Выбрать дату...'}
                                dataSource={globalConsts.selectDateBox}
                                displayExpr={'key'}
                                valueExpr={'value'}
                                value={dateState}
                                onValueChanged={this.handleChangeDateState}
                            />
                        </div>
                    </div>
                    <div className={'form-group row mb-2'}> 
                        <label className={'col-12 col-form-label font-weight-bold'}>От</label>
                        <div className={'col-12'}>
                            <DateBox 
                                type={'datetime'}
                                pickerType={'rollers'}
                                value={dateFrom}
                                id={'from'}
                                onValueChanged={this.handleChangeDate}
                            />
                        </div>
                    </div>
                    <div className={'form-group row mb-2'}> 
                        <label className={'col-12 col-form-label font-weight-bold'}>До</label>
                        <div className={'col-12'}>
                            <DateBox 
                                type={'datetime'}
                                pickerType={'rollers'}
                                value={dateTo}
                                id={'to'}
                                onValueChanged={this.handleChangeDate}
                            />
                        </div>
                    </div>
                </div>
                <div className={'dfw_footer text-center'}>
                    <Button 
                        onClick={this.handleGenerateDoc} 
                        text={'Сформировать отчет'}
                        height={'50px'}
                        width={'90%'}
                    />
                </div>
            </>
        )
    }
}

DocForWashing = connect(globalFuncs.mapStateToProps_global)(DocForWashing);
export default DocForWashing;