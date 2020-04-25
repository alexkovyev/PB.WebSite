import React from 'react';
import PropTypes from 'prop-types';

// Dx
import {
    Button
} from 'devextreme-react';

// global
import globalConsts from 'js/globalConsts';

class PBHeader extends React.Component {
    render() {
        return (
            <header className={'pb_header'}>
                <Button 
                    className={this.props.buttonIcon === globalConsts.headerButtonMode.menu ? 'pb_main_menu_button' : ''}
                    icon={this.props.buttonIcon}
                    onClick={this.props.onGoToPageClick}
                    text={this.props.buttonIcon === globalConsts.headerButtonMode.menu ? 'MENU' : ''}
                />

                <div className={'pb_header_page_title'}>{'PizzaBot - AdminPanel: ' + this.props.title}</div>
            </header>
        )
    }
}

PBHeader.propTypes = {
    buttonIcon: PropTypes.string.isRequired,
    onGoToPageClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
}

export default PBHeader;