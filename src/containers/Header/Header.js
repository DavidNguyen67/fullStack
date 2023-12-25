import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES } from './../../utils';
import { FormattedMessage } from 'react-intl';
class Header extends Component {
  handleChangeLanguage = (lan) => {
    this.props.changeLanguageAppRedux(lan);
  };

  render() {
    const { processLogout, language, user } = this.props;
    const firstName = user?.userInfo?.firstName;
    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={adminMenu} />
        </div>

        <div className="languages">
          <span className="welcome">
            <FormattedMessage id={'title.welcome'} />
            {firstName} !
          </span>
          <span
            className={
              language.toLowerCase() === LANGUAGES.VI.toLowerCase()
                ? 'language-vi active'
                : 'language-vi'
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
          >
            VN
          </span>
          <span
            className={
              language.toLowerCase() === LANGUAGES.EN.toLowerCase()
                ? 'language-en active'
                : 'language-en'
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
          >
            EN
          </span>
          {/* nút logout */}
          <div className="btn btn-logout" onClick={processLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (lan) => dispatch(actions.changeLanguageApp(lan)),
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
