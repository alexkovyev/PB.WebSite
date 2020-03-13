import { combineReducers } from 'redux';

//#region Exchange data between page: IMPORT

import {
    INIT_DATA_FOR_PAGE,
    GET_PAGE_DATA_BY_PAGE_NAME,
    CLEAR_PAGE_DATA_BY_PAGE_NAME,
    CLEAR_ALL_PAGES_DATA,

    GO_TO_PAGE,
} from './actions';

//#endregion
//#region Error initialize: IMPORT

import {
    ERROR
} from './actions';

//#endregion
//#region Load panel visible: IMPORT

import {
    LOAD_PANEL_VISIBLE,
    LOAD_PANEL_INVISIBLE,
    CLEAR_ALL_LOAD_PANELS
} from './actions';

//#endregion
//#region Init context: IMPORT

import {
    INIT_CONTEXT,
    UNMOUNT_CONTEXT,
} from './actions'

//#endregion

//#region Exchange data between page

function dataForPage(state = {}, action) {
    switch (action.type) {
        case INIT_DATA_FOR_PAGE:
        case GET_PAGE_DATA_BY_PAGE_NAME:
            return Object.assign({}, state, action.data);
        case CLEAR_ALL_PAGES_DATA:
        case CLEAR_PAGE_DATA_BY_PAGE_NAME:
        default:
            return state;
    }
}

function goToPage(state = {}, action) {
    switch (action.type) {
        case GO_TO_PAGE:
            window.location.hash = '#' + action.pageName;
            return state;
        default:
            return state;
    }
}

//#endregion

//#region Error initialize

function error(state = 'Here is error!!!', action) {
    switch (action.type) {
        case ERROR:
            const { error } = action.error;
            console.error(error.text);
            return Object.assign({}, state, error);
        default:
            return state;
    }
}

//#endregion

//#region Load panel visible

function visibilityOfLoadingPanel(state = {isLoading: true}, action) {
    switch(action.type) {
        case LOAD_PANEL_INVISIBLE:
        case CLEAR_ALL_LOAD_PANELS:
            return {
                isLoading: false,
            }
        case LOAD_PANEL_VISIBLE:
            return {
                isLoading: true,
            }
        default:
            return state;
    }
}

//#endregion

//#region Init context

function initializedContext(state = {}, action) {
    switch(action.type) {
        case INIT_CONTEXT: {
            delete action['type'];
            return Object.assign(
                state,
                action,
            )
        }
        case UNMOUNT_CONTEXT: {
            return {};
        }
        default: 
            return state;
    }
}

//#endregion

const rootReducer = combineReducers({
    dataForPage,
    goToPage,
    visibilityOfLoadingPanel,
    initializedContext,
    error,
});

export default rootReducer;