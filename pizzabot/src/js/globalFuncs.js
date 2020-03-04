var globalFuncs = {}

//#region Redux global functions

globalFuncs.mapStateToProps_global = function(state) {
    const {
        dataForPage,
        visibilityOfLoadingPanel,
        error
    } = state;

    return {
        isLoading: visibilityOfLoadingPanel.isLoading,
        dataForPage,
        error
    }
}

//#endregion

export default globalFuncs