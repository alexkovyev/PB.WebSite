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
import PointSTFF from './js/Views/PointSTFF/PointSTFF';
import LoadSTFF from './js/Views/PointSTFF/LoadSTFF';
import GenerateDocs from './js/Views/GenerateDocs/GenerateDocs';
import DocForSTFF from './js/Views/GenerateDocs/DocForSTFF';
import DocForWashing from './js/Views/GenerateDocs/DocForWashing';
import DocForSells from './js/Views/GenerateDocs/DocForSells';
import MenuCategories from './js/Views/MenuCategories/MenuCategories';
import IUCategory from './js/Views/MenuCategories/IUCategory';
import MenuDishes from './js/Views/MenuDishes/MenuDishes';
import IUDish from './js/Views/MenuDishes/IUDish';
import OvenPoints from './js/Views/OvenPoints/OvenPoints';
import Operators from './js/Views/Operators/Operators';
import IOperator from './js/Views/Operators/IOperator';
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
            {page: globalConsts.pages.main, component: MainInfoPage, visible: true, },
            {page: globalConsts.pages.productsMovements, component: PointSTFF, visible: true, },
            {page: globalConsts.pages.loadProducts, component: LoadSTFF, visible: false, },
            {page: globalConsts.pages.washPoint, component: WashingPoint, visible: true, },
            {page: globalConsts.pages.changeSystemStatus, component: ChangeSystemStatus, visible: true, },
            {page: globalConsts.pages.outPoints, component: OutPoints, visible: true, },
            {page: globalConsts.pages.generateDocs, component: GenerateDocs, visible: true, },
            {page: globalConsts.pages.docSTFF, component: DocForSTFF, visible: false, },
            {page: globalConsts.pages.docSells, component: DocForSells, visible: false, },
            {page: globalConsts.pages.docWashing, component: DocForWashing, visible: false, },
            {page: globalConsts.pages.menuCategories, component: MenuCategories, visible: true, },
            {page: globalConsts.pages.iUCategory, component: IUCategory, visible: false, },
            {page: globalConsts.pages.menuDishes, component: MenuDishes, visible: true, },
            {page: globalConsts.pages.iUDish, component: IUDish, visible: false, },
            {page: globalConsts.pages.ovenPoints, component: OvenPoints, visible: true, },
            {page: globalConsts.pages.operators, component: Operators, visible: true, },
            {page: globalConsts.pages.iOperator, component: IOperator, visible: false, },
            {page: globalConsts.pages.adBlocks, component: AdBlocks, visible: true, },
            {page: globalConsts.pages.iUAdBlocks, component: IUAdBlock, visible: false, },
            {page: globalConsts.pages.user, component: PersonalCab, visible: true, },

            {button: globalConsts.buttons.logout, action: () => {
                const { 
                    dispatch
                } = this.props;
                dispatch(unmountContext());
                window.location.reload();
            }, visible: true, },
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
                {token && context.User && 
                    <SlideOutMenu 
                        menuItems={pages}
                        availablePages={context.Pages}
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
