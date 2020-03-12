import React from 'react';

// Dx
import { Button } from 'devextreme-react';

// Redux
import { connect } from 'react-redux';
import {
    goToPage,
    changeVisibilityOfLoadingPanel,
} from 'js/Redux/actions';

// Global
import globalFuncs from 'js/globalFuncs';

class HomePage extends React.Component {
    constructor(props){
        super(props);

        this.welcomeMsg = 'Добро пожаловать в административную панель PizzaBot';
        this.forStartWorkMsg = 'Для начала работы, пожалуйста, авторизуйтесь';
        this.supportMsg = 'Для получения логина и пароля обратитесь к администратору';

        this.handleGoToSignInPage = this.handleGoToSignInPage.bind(this);
    }

    componentDidMount() {
        const {
            dispatch
        } = this.props;
        dispatch(changeVisibilityOfLoadingPanel(false));
    }

    handleGoToSignInPage() {
        const {
            dispatch 
        } = this.props;

        dispatch(goToPage('SignIn'));
    }

    render() {
        return (
            <>
                <div className={'text-center mt-5 mb-4 hp_div'}>
                    <h3 className={'mb-3'}>{this.welcomeMsg}</h3>
                    <div className={'mb-3'}> 
                        {true && 
                            <img 
                                src={'/themes/images/NoImageIcon.png'} 
                                alt={'No image'}
                            />
                        }
                        {false &&
                            <img alt={'Welcome image'}/>
                        }
                    </div>
                    <h5 className={'mb-4'}>{this.forStartWorkMsg}</h5>
                    <h5>{this.supportMsg}</h5>
                </div>
                <div className={'hp_footer text-center'}>
                    <Button 
                        onClick={this.handleGoToSignInPage} 
                        text={'Начать работу'}
                        height={'50px'}
                        width={'80%'}
                    />
                </div>
            </>
        )
    }
}

HomePage = connect(globalFuncs.mapStateToProps_global)(HomePage)
export default HomePage;