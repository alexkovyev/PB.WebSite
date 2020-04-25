import React from 'react';

// Redux
import { connect } from 'react-redux';
import {
    goToPage
} from 'js/Redux/actions';

// Dx
import {
    Button
} from 'devextreme-react';

// global
import globalFuncs from 'js/globalFuncs';

class GenerateDocs extends React.Component {
    constructor(props) {
        super(props);

        this.handleGoToSTFFDocs = this.handleGoToSTFFDocs.bind(this);
        this.handleGoToSellsDocs = this.handleGoToSellsDocs.bind(this);
        this.handleGoToWashingDocs = this.handleGoToWashingDocs.bind(this);
    }

    handleGoToSTFFDocs() {
        const {
            dispatch
        } = this.props;

        dispatch(goToPage('DocSTFF'));
    }

    handleGoToSellsDocs() {
        const {
            dispatch
        } = this.props;

        dispatch(goToPage('DocSells'));
    }

    handleGoToWashingDocs() {
        const {
            dispatch
        } = this.props;

        dispatch(goToPage('DocWashing'));
    }

    render() {
        return (
            <> 
                <div className={'gd_div'}>
                    <div className={'text-center mt-1 mb-4'}> 
                        <h3 className={'mb-3'}>Отчеты</h3>
                        <div className={'gd_strt_bttn text-center mb-3'}>
                            <Button 
                                onClick={this.handleGoToSTFFDocs} 
                                text={'Данные о запасах'}
                                height={'50px'}
                                width={'90%'}
                            />
                        </div>
                        <div className={'gd_strt_bttn text-center mb-3'}>
                            <Button 
                                onClick={this.handleGoToSellsDocs} 
                                text={'Данные о продажах'}
                                height={'50px'}
                                width={'90%'}
                            />
                        </div>
                        <div className={'gd_strt_bttn text-center mb-3'}>
                            <Button 
                                onClick={this.handleGoToWashingDocs} 
                                text={'Данные о мойке'}
                                height={'50px'}
                                width={'90%'}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

GenerateDocs = connect(globalFuncs.mapStateToProps_global)(GenerateDocs);
export default GenerateDocs;