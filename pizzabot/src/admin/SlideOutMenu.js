import React from "react";
import {
    Route,
    HashRouter,
    Redirect,
} from "react-router-dom";
import PropTypes from 'prop-types';

// Dx
import {
    SlideOutView,
    Template,
    List,
    ScrollView
} from 'devextreme-react';

// Local cntrls
import PBHeader from './js/Controls/PBHeader';

// global
import globalConsts from 'js/globalConsts';

class SlideOutMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
            headerButtonMode: globalConsts.headerButtonMode.menu,
            currentPageTitle: '',
        };
    }

    componentDidMount() {
        let startPage = null;
        for (let page in globalConsts.pages) {
            if (globalConsts.pages[page].path === this.hashRouter.history.location.pathname) {
                startPage = globalConsts.pages[page];
                break;
            }
        }
        if (startPage) {
            this.setState({ currentPageTitle: startPage.title });
        }

        this.hashRouter.history.pizzabot = {
            history: []
        };

        this.hashRouter.history.pizzabot.push = (params) => {
            if (!params.page) {
                return;
            }

            let setStateData = {};

            let t = params.target || globalConsts.pageTarget.blank;
            if (t === globalConsts.pageTarget.root) {
                this.hashRouter.history.pizzabot.history = [];
                setStateData.headerButtonMode = globalConsts.headerButtonMode.menu;
            }
            else if (t === globalConsts.pageTarget.blank) {
                this.hashRouter.history.pizzabot.history.push({
                    pathname: this.hashRouter.history.location.pathname,
                    title: this.state.currentPageTitle,
                    state: params.currentPageState
                });
                setStateData.headerButtonMode = globalConsts.headerButtonMode.back;
            }

            this.hashRouter.history.push({
                pathname: params.page.path,
                state: params.state
            });

            setStateData.currentPageTitle = params.page.title;
            this.setState(setStateData);
        };

        this.hashRouter.history.pizzabot.canBack = () => {
            return this.hashRouter.history.pizzabot.history.length > 0;
        };

        this.hashRouter.history.pizzabot.back = () => {
            if (this.hashRouter.history.pizzabot.canBack()) {
                let prevPage = this.hashRouter.history.pizzabot.history.pop();
                this.setState({ currentPageTitle: prevPage.title });
                this.hashRouter.history.push({
                    pathname: prevPage.pathname,
                    state: prevPage.state
                });

                if (!this.hashRouter.history.pizzabot.canBack()) {
                    this.setState({ headerButtonMode: globalConsts.headerButtonMode.menu });
                }
            }
        };
    }

    show = () => {
        this.setState({ menuVisible: true });
    }

    hide = () => {
        this.setState({ menuVisible: false });
    }

    menuItemClick = (e) => {
        this.hashRouter.history.pizzabot.push({
            page: e.page,
            target: globalConsts.pageTarget.root
        });
        this.hide();
    }

    headerButtonOnClick = (e) => {
        if (this.state.headerButtonMode === globalConsts.headerButtonMode.menu) {
            this.show();
        }
        else {
            this.hashRouter.history.pizzabot.back();
        }
    }

    renderListItem = (e) => {
        return (
            <div>
                {e.page && 
                    <div 
                        onClick={() => { this.menuItemClick(e); }} 
                        className={"pb_slideout_menu_item dx-navigation-item " + (window.location.hash.indexOf(e.page.path) !== -1 ? 'font-weight-bold' : '')}
                    >
                        {e.page.title}
                    </div>
                }
                {e.button &&
                    <div
                        onClick={() => { e.action(); }}
                        className={"pb_slideout_menu_item dx-navigation-item"}
                    > 
                        {e.button.title}
                    </div>
                }
            </div>
        );
    }

    render() {
        return (
            <HashRouter ref={x => this.hashRouter = x}>
                {this.props.defaultPage && 
                    <Redirect exact from="/" to={'/' + this.props.defaultPage} />
                }
                <div className="pb_slideout_container">
                    <SlideOutView
                        menuTemplate="menu"
                        contentTemplate="content"
                        menuVisible={this.state.menuVisible}
                        onOptionChanged={(e) => {
                            if (e.name === "menuVisible") {
                                this.setState({ menuVisible: e.value });
                            }
                        }}
                    >
                        <Template name="menu">
                            <List
                                dataSource={this.props.menuItems.filter(item => item.visible)}
                                itemRender={this.renderListItem}
                                width="350px"
                            />
                        </Template>

                        <Template name="content">
                            <div className="d-flex flex-column h-100">
                                <PBHeader
                                    buttonIcon={this.state.headerButtonMode}
                                    onGoToPageClick={this.headerButtonOnClick}
                                    title={this.state.currentPageTitle}
                                />
                                <ScrollView>
                                    <div className="pb_main_content_holder">
                                        {this.props.menuItems.map((e, i) => {
                                            if (e.page) {
                                                return <Route exact key={i} path={e.page.path} component={e.component} />
                                            }
                                            return <React.Fragment key={i}> </React.Fragment>
                                        })}
                                    </div>
                                </ScrollView>
                            </div>
                        </Template>
                    </SlideOutView>
                </div>
            </HashRouter>
        );
    }
}

SlideOutMenu.propTypes = {
    defaultPage: PropTypes.string,
    menuItems: PropTypes.array.isRequired,
}

export default SlideOutMenu;