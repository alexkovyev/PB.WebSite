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
    },
    signIn: {
        path: '/SignIn',
    },

    main: {
        path: '/Main',
        title: 'Главная страница',
    },
    productsMovements: {
        path: '/ProductsMovements',
        title: 'Работа с запасами',
    },
    loadProducts: {
        path: '/LoadProducts',
    },
    washPoint: {
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
    generateDocs: {
        path: '/GenerateDocs', 
        title: 'Отчеты',
    },
    docSTFF: {
        path: '/DocSTFF',
    },
    docSells: {
        path: '/DocSells',
    },
    docWashing: {
        path: '/DocWashing',
    },
    menuCategories: {
        path: '/MenuCategories',
        title: 'Работа с категориями',
    },
    iUCategory: {
        path: '/IUCategory',
    },
    menuDishes: {
        path: '/MenuDishes',
        title: 'Работа с меню',
    },
    iUDish: {
        path: '/IUDish',
    },
    ovenPoints: {
        path: '/OvenPoints',
        title: 'Печи',
    },
    operators: {
        path: '/Operators',
        title: 'Управление пользователями',
    },
    iOperator: {
        path: '/IOperator',
    },
    adBlocks: {
        path: '/AdBlocks',
        title: 'Рекламные блоки',
    },
    iUAdBlocks: {
        path: '/IUAdBlocks',
    },
    user: {
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
    load_stff: 'MVMNT_STFF',
    sysStatus: 'CHANGE_SYS_STATUS',
}

//#endregion

//#region Type of cntrls

globalConsts.cntrlsType = {
    outpoints: 'OutPointCNTRL',
    ovenpoints: 'OvenPointCNTRL',
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