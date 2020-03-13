var globalConsts = {}

//#region SlideOutMenu

globalConsts.headerButtonMode = {
    menu: 'menu',
    back: 'back',
};

globalConsts.pageTarget = {
    blank: 0,
    root: 1,
    current: 2,
};

globalConsts.pages = {
    home: {
        path: '/Home',
        title: 'Home'
    },
    signIn: {
        path: '/SignIn',
        title: 'SignIn',
    },

    mainPage: {
        path: '/Main',
        title: 'Главная страница',
    },
    loadProducts: {
        path: '/LoadProducts',
        title: 'Работа с запасами',
    },
    startCleanning: {
        path: '/WashPoint',
        title: 'Запуск мойки',
    }, 
    changeSystemStatus: {
        path: '/ChangeSystemStatus',
        title: 'Включение/Выключение системы',
    },
    outPoints: {
        path: '/OutPoints',
        title: 'Окно выдачи',
    },
    sendDocs: {
        path: '/GenerateDocs', 
        title: 'Отчеты',
    },
    personalCab: {
        path: '/User',
        title: 'Личный кабинет'
    },
};

globalConsts.buttons = {
    logout: {
        title: 'Выйти из системы',
    }
};

//#endregion

//#region Type of operations

globalConsts.operationTypes = {
    washing: 'WASHING',
    load_stff: 'LOAD_STFF',
}

//#endregion

export default globalConsts