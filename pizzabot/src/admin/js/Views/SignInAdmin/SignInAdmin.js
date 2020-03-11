import React from 'react';

// Redux
import { connect } from 'react-redux';
<<<<<<< HEAD
import {
    changeVisibilityOfLoadingPanel,
    initContext
} from 'js/Redux/actions';
=======
>>>>>>> master

// Global
import globalFuncs from 'js/globalFuncs';

// Dx
import { 
    TextBox,
    Button,
} from 'devextreme-react'

class SignInAdmin extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            login: '',
            password: '',
<<<<<<< HEAD

            showErrorMsg: false,
=======
>>>>>>> master
        }

        this.handleLoginChanged = this.handleLoginChanged.bind(this);
        this.handlePasswordChanged = this.handlePasswordChanged.bind(this);
        this.handleSignInClick = this.handleSignInClick.bind(this);
    }

    handleLoginChanged(args) {
        this.setState(() => {
            return {
                login: args.value,
            }
        });
    }

    handlePasswordChanged(args) {
        this.setState(() => {
            return {
                password: args.value,
            }
        })
    }

    handleSignInClick() {
<<<<<<< HEAD
        const {
            login,
            password
        } = this.state;

        const {
            dispatch
        } = this.props;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'POST',
            '/users/signin',
            {
                login,
                password
            },
            (response) => {
                this.setState(() => {
                    return {
                        showErrorMsg: false,
                    }
                })
                dispatch(initContext(response));
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                this.setState(() => {
                    return {
                        showErrorMsg: true,
                    }
                })
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        )
=======

>>>>>>> master
    }

    render() {
        const {
            login, 
<<<<<<< HEAD
            password,

            showErrorMsg
=======
            password
>>>>>>> master
        } = this.state;

        return (
            <> 
                <div className={'text-center mt-5 mb-4 sign_in_div'}>
                    <div className={'mb-3'}> 
                        {true && 
                            <img 
                                src={require('themes/images/NoImageIcon.png')} 
                                alt={'No image'}
                            />
                        }
                        {false &&
                            <img alt={'Welcome image'}/>
                        }
                    </div>
                    <h1>Авторизация</h1>
                    <div className={'sign_in_form'}>
                        <div className={'form-group text-left'}>
                            <label>Номер телефона:</label>
                            <TextBox
                                mode={'tel'}
                                mask={'+7 (000) 000-00-00'}
                                placeholder={'Введите номер телефона...'}
                                value={login}
<<<<<<< HEAD
                                isValid={!showErrorMsg}
                                onValueChanged={this.handleLoginChanged}
                                onEnterKey={this.handleSignInClick}
=======
                                onValueChanged={this.handleLoginChanged}
>>>>>>> master
                            />
                        </div>
                        <div className={'form-group text-left mb-4'}>
                            <label>Пароль:</label>
                            <TextBox 
                                mode={'password'}
<<<<<<< HEAD
                                isValid={!showErrorMsg}
                                placeholder={'Введите пароль...'}
                                value={password}
                                onValueChanged={this.handlePasswordChanged}
                                onEnterKey={this.handleSignInClick}
=======
                                placeholder={'Введите пароль...'}
                                value={password}
                                onValueChanged={this.handlePasswordChanged}
>>>>>>> master
                            />
                        </div>
                        <Button 
                            onClick={this.handleSignInClick} 
                            text={'Войти'}
                            height={'50px'}
                            width={'80%'}
                        />
                        <div className={'mt-4 row justify-content-center'}>
                            <div className={'col-1 text-right pr-0'}>
                                <img 
                                    className={'mt-1'}
                                    src={require('themes/images/KeyIcon.png')}
                                    alt={'Key'}
                                />
                            </div>
                            <div className={'col-md-2 col-6 text-left sing_in_footer_msg'}>
                                <small className={'form-text text-muted'}>
                                    Забыли пароль? <br/>
                                    Обратитесь к администратору
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

SignInAdmin = connect(globalFuncs.mapStateToProps_global)(SignInAdmin);
export default SignInAdmin;