import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    HashRouter,
    Route,
    Redirect
} from 'react-router-dom';

// Actions
import {

} from 'js/Redux/actions';

// Dx
import { LoadPanel } from 'devextreme-react';

// Local cntrls
import SlideOutMenu from './SlideOutMenu';

// Pages
import HomePage from './js/Views/HomePage/HomePage'
import SignInAdmin from './js/Views/SignInAdmin/SignInAdmin';

import MainInfoPage from './js/Views/MainInfoPage/MainInfoPage';
import ChangeSystemStatus from './js/Views/ChangeSystemStatus/ChangeSystemStatus';

// Redux store, actions, helpers.
import { connect, Provider } from 'react-redux';
import configureStore from 'js/Redux/configureStore';

// global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';

const store = configureStore();
class Main extends Component {
    render() {
        const pages = [
            {page: globalConsts.pages.home, component: HomePage, visible: false},
            {page: globalConsts.pages.signIn, component: SignInAdmin, visible: false,},

            {page: globalConsts.pages.mainPage, component: MainInfoPage, visible: true,},
            {page: globalConsts.pages.changeSystemStatus, component: ChangeSystemStatus, visible: true},
        ];

        //Redux
        const {
            isLoading
        } = this.props;

        return (
            <>
                <LoadPanel 
                    showIndicator={true}
                    message={'Loading...'}
                    visible={isLoading}
                />

                {true &&
                    <HashRouter>
                        <Redirect from='/' to='/Home' excat />
                        <Route path={'/Home'} component={HomePage} />
                        <Route path={'/SignIn'} component={SignInAdmin} />
                    </HashRouter>
                }
                {false && 
                    <SlideOutMenu 
                        menuItems={pages}
                        defaultPage={'Home'}
                    />
                }
            </>
        );
    }
}

Main.propTypes = {
    isLoading: PropTypes.bool.isRequired,
}

const MainComponent = connect(globalFuncs.mapStateToProps_global)(Main);
class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <MainComponent />
            </Provider>
        )
    }
}

export default Root;
