// global
import globalFuncs from 'js/globalFuncs';

export const CLEAR_ALL_PAGES_DATA = 'CLEAR_ALL_PAGES_DATA';
export const CLEAR_PAGE_DATA_BY_PAGE_NAME = 'CLEAR_PAGE_DATA_BY_PAGE_NAME';

export const GET_PAGE_DATA_BY_PAGE_NAME = 'GET_PAGE_DATA_BY_PAGE_NAME';
export const INIT_DATA_FOR_PAGE = 'INIT_DATA_FOR_PAGE';

export const GO_TO_PAGE = 'GO_TO_PAGE';

export const ERROR = 'ERROR';

export const LOAD_PANEL_VISIBLE = 'LOAD_PANEL_VISIBLE';
export const LOAD_PANEL_INVISIBLE = 'LOAD_PANEL_INVISIBLE';
export const CLEAR_ALL_LOAD_PANELS = 'CLEAR_ALL_LOAD_PANELS';

export const INIT_CONTEXT = 'INIT_CONTEXT';


//#region Exchange data between pages

let dataSource = {};

export function clearDataByPageName(pageName) {
    if (dataSource && dataSource[pageName]) {
        delete dataSource[pageName];

        return {
            type: CLEAR_PAGE_DATA_BY_PAGE_NAME,
        }
    }
}

export function clearPagesData() {
    dataSource = {};
    return {
        type: CLEAR_ALL_PAGES_DATA,
    }
}

export function getDataByPageName(pageName) {
    return {
        type: GET_PAGE_DATA_BY_PAGE_NAME,
        data: dataSource[pageName],
    }
}

function initPageData(data) {
    return {
        type: INIT_DATA_FOR_PAGE,
        data,
    }
}

function redirectToPage(pageName) {
    return {
        type: GO_TO_PAGE,
        pageName
    }
}

export function goToPageTemporary(pageName, data, pageNameSource, dataOfSource, isUnitedWithExistedDataOfTarget = false, isUnitedWithExistedDataOfSource = false) {
    return dispatch => {
        if (data) {
            if (dataSource[pageName] && isUnitedWithExistedDataOfTarget) {
                dataSource[pageName] = Object.assign(
                    dataSource[pageName],
                    data
                );
            } else {
                dataSource[pageName] = data;
            }
        }

        if (dataOfSource) {
            if (dataSource[pageNameSource] && isUnitedWithExistedDataOfSource) {
                dataSource[pageNameSource] = Object.assign(
                    dataSource[pageNameSource],
                    dataOfSource
                );
            } else {
                dataSource[pageNameSource] = dataOfSource;
            }
        }

        if (dataSource[pageName]) {
            dispatch(initPageData(dataSource[pageName]));
        }
        dispatch(redirectToPage(pageName));
    }
}

export function goToPage(pageName, data, isUnitedWithExistedData = false) {
    return dispatch => {
        if (data) {
            if (dataSource[pageName] && isUnitedWithExistedData) {
                dataSource[pageName] = Object.assign(
                    dataSource[pageName],
                    data
                );
            } else {
                dataSource[pageName] = data;
            }
        }

        if (dataSource[pageName]) {
            dispatch(initPageData(dataSource[pageName]));
        }
        dispatch(redirectToPage(pageName))
    }
}

//#endregion

//#region Load panel

let countOfLoaders = 0;

export function changeVisibilityOfLoadingPanel(visible) {
    countOfLoaders = visible ? countOfLoaders + 1 : countOfLoaders - 1;
    countOfLoaders = countOfLoaders < 0 ? 0 : countOfLoaders;
    return {
        type: countOfLoaders > 0 ? LOAD_PANEL_VISIBLE : LOAD_PANEL_INVISIBLE
    };
}

export function clearAllLoadingPanels(){
    countOfLoaders = 0;
    return {
        type: CLEAR_ALL_LOAD_PANELS,
    }
}

//#endregion

//#region Init context

export function initContext(data) {
    if (data.token) {
        globalFuncs.setUserSession(data.token);
    }

    return {
        type: INIT_CONTEXT,
        User: data.context.User,
    }
}

//#endregion
