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
    personalCab: {
        path: '/User',
        title: 'Личный кабинет'
    },
    loadProducts: {
        path: '/LoadProducts',
        title: 'Работа с запасами',
    },
    startCleanning: {
        path: '/StartCleanning',
        title: 'Запуск мойки',
    },
    changeSystemStatus: {
        path: '/ChangeSystemStatus',
        title: 'Включение/Выключение системы',
    }
};

globalConsts.buttons = {
    logout: {
        title: 'Выйти из системы',
    }
};

//#endregion

export default globalConsts