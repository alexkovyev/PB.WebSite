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
import AdBlocks from './js/Views/AdBlocks/AdBlocks';
import IUAdBlock from './js/Views/AdBlocks/IUAdBlock';

// Redux store, actions, helpers.
import { connect, Provider } from 'react-redux';
import configureStore from 'js/Redux/configureStore';
import {
    initContext,
    unmountContext,
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

        var locationHash = window.location.hash.replace('#', '')
        locationHash = locationHash.charAt(0).toLowerCase() + locationHash.substring(1);

        dispatch(changeVisibilityOfLoadingPanel(true));
        globalFuncs.sendRequest(
            'GET',
            `/verifyToken?token=${globalFuncs.getToken()}&pageName=${locationHash}`,
            null,
            (response) => {
                dispatch(initContext(response));
                dispatch(changeVisibilityOfLoadingPanel(false));
            },
            (response) => {
                dispatch(unmountContext());
                dispatch(changeVisibilityOfLoadingPanel(false));
            }
        );
    }

    render() {
        const pages = [
            
        ];

        //Redux
        const {
            isLoading,
            context
        } = this.props;

        const token = globalFuncs.getToken();
        console.log(context);

        return (
            <>
                <LoadPanel 
                    showIndicator={true}
                    message={'Loading...'}
                    visible={isLoading}
                />

                {!token && !context.User &&
                    <HashRouter hashType={'noslash'}>
                        <Redirect from='/' to='/Home' exact />
                        <Route path={'/Home'} component={HomePage} />
                        <Route path={'/SignIn'} component={SignInAdmin} />
                    </HashRouter>
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
