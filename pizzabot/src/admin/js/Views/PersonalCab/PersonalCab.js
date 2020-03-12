import React from 'react';

// Redux
import { connect } from 'react-redux';
import {
    initContext,
    changeVisibilityOfLoadingPanel,
    clearAllLoadingPanels
} from 'js/Redux/actions';

// Dx
import { 
    TextBox
} from 'devextreme-react';
import validationEngine from 'devextreme/ui/validation_engine';
import {
    Validator,
    RequiredRule,
    CompareRule,
    EmailRule,
    PatternRule,
    StringLengthRule,
    RangeRule,
    NumericRule
} from 'devextreme-react/validator';

// global
import globalFuncs from 'js/globalFuncs';

class PersonalCab extends React.Component {
    constructor(props){
        super(props);

        const {
            context
        } = this.props;

        this.state = {
            isEditMode: false,

            User: context.User,
            pwd: {}
        }

        this.handleEditPersonalInfo = this.handleEditPersonalInfo.bind(this);
        this.handleChangeNameField = this.handleChangeNameField.bind(this);
        this.handleChangeSNameField = this.handleChangeSNameField.bind(this);
        this.handleChangeLNameField = this.handleChangeLNameField.bind(this);
        this.handleChangeEmailField = this.handleChangeEmailField.bind(this);
        this.handleChangePhoneField = this.handleChangePhoneField.bind(this);

        this.handleChangeOldPwd = this.handleChangeOldPwd.bind(this);
        this.handleChangeNewPwd = this.handleChangeNewPwd.bind(this);
        this.handleChangeAcceptNewPwd = this.handleChangeAcceptNewPwd.bind(this);

        this.handleFinishEditing = this.handleFinishEditing.bind(this);
    }

    handleFinishEditing() {
        this.setState((state, props) => {
            return {
                isEditMode: false,
                pwd: {},
                User: props.context.User,
            }
        })
    }

    handleEditPersonalInfo() {
        if (this.state.isEditMode) {
            var allFieldValidation = validationEngine.validateGroup();
            if (!allFieldValidation.isValid) return;

            const {
                dispatch
            } = this.props;
            dispatch(changeVisibilityOfLoadingPanel(true));

            const {
                User,
                pwd
            } = this.state;

            globalFuncs.sendRequest(
                'POST',
                '/users/update',
                {
                    refid: User.RefID,
                    userfn: User.FirstName,
                    usersn: User.SecondName,
                    userln: User.LastName,
                    useremail: User.Email,
                    userphone: User.Phone,
                    oldpwd: pwd.oldPwd,
                    execby: User.FirstName + User.LastName,
                },
                (response) => {
                    if (response && response.isSuccess) {
                        const {
                            User
                        } = this.state;
                        dispatch(initContext({
                            context: {
                                User,
                            }
                        }));
                    }
                    dispatch(changeVisibilityOfLoadingPanel(false));
                },
                (response) => {
                    dispatch(changeVisibilityOfLoadingPanel(false));
                }
            )
        }

        this.setState((state) => {
            const {
                isEditMode
            } = state;

            return {
                isEditMode: !isEditMode
            }
        })
    }
    
    //#region Change events

    handleChangeNameField(args) {
        this.setState((state) => {
            var {
                User
            } = state;
            User = Object.assign({}, User, {
                FirstName: args.value,
            });
            return {
                User
            }
        });
    }

    handleChangeSNameField(args) {
        this.setState((state) => {
            var {
                User
            } = state;
            User = Object.assign({}, User, {
                SecondName: args.value,
            });
            return {
                User
            }
        });
    }

    handleChangeLNameField(args) {
        this.setState((state) => {
            var {
                User
            } = state;
            User = Object.assign({}, User, {
                LastName: args.value,
            });
            return {
                User
            }
        });
    }

    handleChangeEmailField(args) {
        this.setState((state) => {
            var {
                User
            } = state;
            User = Object.assign(User, {
                Email: args.value,
            });
            return {
                User
            }
        });
    }

    handleChangePhoneField(args) {
        this.setState((state) => {
            var {
                User
            } = state;
            User = Object.assign(User, {
                Phone: args.value,
            });
            return {
                User
            }
        });
    }

    //#region Change pwd

    handleChangeOldPwd(args) {
        this.setState((state) => {
            var {
                pwd
            } = state;
            pwd = Object.assign(pwd, {
                oldPwd: args.value
            });
            return {
                pwd,
            }
        })
    }

    handleChangeNewPwd(args) {
        this.setState((state) => {
            var {
                pwd
            } = state;
            pwd = Object.assign(pwd, {
                newPwd: args.value
            });
            return {
                pwd,
            }
        })
    }

    handleChangeAcceptNewPwd(args) {
        this.setState((state) => {
            var {
                pwd
            } = state;
            pwd = Object.assign(pwd, {
                checkNewPwd: args.value
            });
            return {
                pwd,
            }
        })
    }

    //#endregion

    //#endregion

    render() {
        const {
            isEditMode,
            User,
            pwd,
        } = this.state;

        const {
            FirstName,
            SecondName,
            RoleName
        } = this.props.context.User;

        return (
            <> 
                <div className={'text-center mt-2 mb-4 pc_div'}>
                    <div className={'mb-3'}> 
                        {true && 
                            <img 
                                src={'/themes/images/NoAvatarImage.png'} 
                                alt={'No image'}
                            />
                        }
                        {false &&
                            <img alt={'Welcome image'}/>
                        }
                    </div>
                    <h3 className={'font-weight-bold'}>{FirstName + ' ' + SecondName}</h3>
                    <h5 className={'text-muted'}>{RoleName}</h5>
                </div>
                <div className={'pc_edit_bttn_container'}>
                    <div 
                        className={'row justify-content-center'}
                        onClick={this.handleEditPersonalInfo}
                    >
                        <div className={'col-1 text-right pr-0'}>
                            <img 
                                className={'mt-1 pc_edit_img'}
                                src={isEditMode 
                                    ? '/themes/images/AcceptIcon.png'
                                    : '/themes/images/EditIcon.png'
                                }
                                alt={'Key'}
                            />
                        </div>
                        <div className={'col-md-2 col-6 text-right pc_footer_msg'}>
                            <label className={'form-text text-muted'}>
                                {isEditMode ? 'Применить' : 'Редактировать'}
                            </label>
                        </div>
                    </div>
                    {isEditMode && 
                        <div 
                            className={'row justify-content-center'}
                            onClick={this.handleFinishEditing}
                        >
                            <div className={'col-1 text-right pr-0'}>
                                <img 
                                    className={'mt-1 pc_edit_img'}
                                    src={'themes/images/CloseIcon.png'}
                                    alt={'Key'}
                                />
                            </div>
                            <div className={'col-md-2 col-6 text-right pc_footer_msg'}>
                                <label className={'form-text text-muted'}>
                                    {'Закрыть'}
                                </label>
                            </div>
                        </div>
                    }   
                </div>
                <hr className={'mt-1'} />
                <div className={'pc_main_content'}>
                    <div className={'form-group row'}>
                        <label className={'col-3 col-form-label'}>Имя</label>
                        <div className={'col-9'}>
                            <TextBox 
                                readOnly={!isEditMode}
                                value={User.FirstName}
                                mode={'text'}
                                placeholder={'Введите имя...'}
                                onValueChanged={this.handleChangeNameField}
                            > 
                                <Validator>
                                    <RequiredRule message={'Имя пользователя обязательно для заполнения'} />
                                </Validator>
                            </TextBox>
                        </div>
                    </div>
                    <div className={'form-group row'}>
                        <label className={'col-3 col-form-label'}>Фамилия</label>
                        <div className={'col-9'}>
                            <TextBox 
                                readOnly={!isEditMode}
                                value={User.SecondName}
                                mode={'text'}
                                placeholder={'Введите фамилию...'}
                                onValueChanged={this.handleChangeSNameField}
                            >
                                <Validator>
                                    <RequiredRule message={'Фамилия пользователя обязательно для заполнения'} />
                                </Validator>
                            </TextBox>
                        </div>
                    </div>
                    <div className={'form-group row'}>
                        <label className={'col-3 col-form-label'}>Отчество</label>
                        <div className={'col-9'}>
                            <TextBox 
                                readOnly={!isEditMode}
                                value={User.LastName}
                                mode={'text'}
                                placeholder={'Введите отчество (если имеется)...'}
                                onValueChanged={this.handleChangeLNameField}
                            />
                        </div>
                    </div>
                    <div className={'form-group row'}>
                        <label className={'col-3 col-form-label'}>Email</label>
                        <div className={'col-9'}>
                            <TextBox 
                                readOnly={!isEditMode}
                                value={User.Email}
                                mode={'email'}
                                placeholder={'Введите email...'}
                                onValueChanged={this.handleChangeEmailField}
                            >
                                <Validator>
                                    <RequiredRule message={'Email пользователя обязательно для заполнения'} />
                                </Validator>
                            </TextBox>
                        </div>
                    </div>
                    <div className={'form-group row'}>
                        <label className={'col-3 col-form-label'}>Телефон</label>
                        <div className={'col-9'}>
                            <TextBox 
                                readOnly={!isEditMode}
                                value={User.Phone}
                                mode={'tel'}
                                mask={'+7 (000) 000-00-00'}
                                placeholder={'Введите номер телефона...'}
                                onValueChanged={this.handleChangePhoneField}
                            >
                                <Validator>
                                    <RequiredRule message={'Номер телефона пользователя обязательно для заполнения'} />
                                </Validator>
                            </TextBox>
                        </div>
                    </div>
                    {isEditMode && 
                        <>
                            <div className={'form-group row'}>
                                <label className={'col-3 col-form-label'}>Текущий</label>
                                <div className={'col-9'}>
                                    <TextBox 
                                        mode={'password'}
                                        placeholder={'Введите старый пароль...'}
                                        onValueChanged={this.handleChangeOldPwd}
                                    >
                                        <Validator>
                                            <RequiredRule message={'Пароль пользователя обязательно для заполнения'} />
                                        </Validator>
                                    </TextBox>
                                </div>
                            </div>
                            <div className={'form-group row'}>
                                <label className={'col-3 col-form-label'}>Новый</label>
                                <div className={'col-9'}>
                                    <TextBox 
                                        mode={'password'}
                                        placeholder={'Введите новый пароль...'}
                                        value={pwd.newPwd}
                                        onValueChanged={this.handleChangeNewPwd} />
                                </div>
                            </div>
                            {pwd.newPwd && 
                                <div className={'form-group row'}>
                                    <label className={'col-3 col-form-label'}>Подтвердить</label>
                                    <div className={'col-9'}>
                                        <TextBox 
                                            mode={'password'}
                                            placeholder={'Подтвердите новый пароль...'}
                                            value={pwd.checkNewPwd}
                                            onValueChanged={this.handleChangeAcceptNewPwd}
                                        >
                                            <Validator>
                                                <CompareRule message={'Новые пароли не совпадают'} comparisonTarget={() => { return pwd.newPwd === pwd.checkNewPwd }} />
                                            </Validator>
                                        </TextBox>
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>
            </>
        )
    }
}

PersonalCab = connect(globalFuncs.mapStateToProps_global)(PersonalCab);
export default PersonalCab;

