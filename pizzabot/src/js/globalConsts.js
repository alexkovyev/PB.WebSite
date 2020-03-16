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
    docForSTFF: {
        path: '/DocSTFF',
    },
    docForSells: {
        path: '/DocSells',
    },
    docForWashing: {
        path: '/DocWashing',
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
    sysStatus: 'CHANGE_SYS_STATUS',
}

//#endregion

//#region Type of cntrls

globalConsts.cntrlsType = {
    outpoints: 'OutPointCNTRL',
}

//#endregion

globalConsts.selectDateBox = [
    {key: 'За последний час', value: 'LH'},
    {key: 'За сегодня', value: 'TD'}, 
    {key: 'За вчерашний день', value: 'YD'},
    {key: 'За текущую неделю', value: 'TW'},
    {key: 'За текущий месяц', value: 'TM'},
    {key: 'За текущий квартал', value: 'TQ'}, 
    {key: 'За текущий год', value: 'TY'}, 
    {key: 'За последние два дня', value: 'LT'},
    {key: 'За последний неделю', value: 'LW'}, 
    {key: 'За последний месяц', value: 'LM'}, 
    {key: 'За последний квартал', value: 'LQ'},
    {key: 'За последний год', value: 'LY'},
]

export default globalConsts