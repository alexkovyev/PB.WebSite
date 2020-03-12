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
import PersonalCab from './js/Views/PersonalCab/PersonalCab';
import WashingPoint from './js/Views/WashingPoint/WashingPoint';
import OutPoints from './js/Views/OutPoints/OutPoints';
import GenerateDocs from './js/Views/GenerateDocs/GenerateDocs';

// Redux store, actions, helpers.
import { connect, Provider } from 'react-redux';
import configureStore from 'js/Redux/configureStore';
import {
    initContext,
    changeVisibilityOfLoadingPanel,
} from 'js/Redux/actions';

// global
import globalFuncs from 'js/globalFuncs';
import globalConsts from 'js/globalConsts';

const store = configureStore();
class Main extends Component {
    componentDidMount() {
        const {
            dispatch
        } = this.props;

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'GET',
            `/verifyToken?token=${globalFuncs.getToken()}`,
            null,
            (response) => {
                dispatch(initContext(response));
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        );
    }

    render() {
        const pages = [
            {page: globalConsts.pages.mainPage, component: MainInfoPage, visible: true, },
            {page: globalConsts.pages.startCleanning, component: WashingPoint, visible: true, },
            {page: globalConsts.pages.changeSystemStatus, component: ChangeSystemStatus, visible: true, },
            {page: globalConsts.pages.outPoints, component: OutPoints, visible: true, },
            {page: globalConsts.pages.sendDocs, component: GenerateDocs, visible: true, },
            {page: globalConsts.pages.personalCab, component: PersonalCab, visible: true, },

            {button: globalConsts.buttons.logout, action: () => {
                globalFuncs.removeUserSession();
                window.location.reload();
            }, visible: true, },
        ];

        //Redux
        const {
            isLoading,
        } = this.props;

        return (
            <>
                <LoadPanel 
                    showIndicator={true}
                    message={'Loading...'}
                    visible={false}
                />

                {!globalFuncs.getToken() &&
                    <HashRouter hashType={'noslash'}>
                        <Redirect from='/' to='/Home' exact />
                        <Route path={'/Home'} component={HomePage} />
                        <Route path={'/SignIn'} component={SignInAdmin} />
                    </HashRouter>
                }
                {globalFuncs.getToken() && 
                    <SlideOutMenu 
                        menuItems={pages}
                        defaultPage={'Main'}
                    />
                }
            </>
        );
    }
}

Main.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    context: PropTypes.object.isRequired,
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
