import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from './../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }

  handleChangeLanguage = (lan) => {
    this.props.changeLanguageAppRedux(lan);
  };
  componentDidMount() {
    const { userInfo } = this.props;
    let menu = [];

    if (userInfo && !_.isEmpty(userInfo)) {
      const { roleId } = userInfo;
      switch (roleId) {
        case USER_ROLE.ADMIN:
          menu = adminMenu;
          break;
        case USER_ROLE.DOCTOR:
          menu = doctorMenu;
          break;
        default:
          break;
      }
      this.setState((prevState) => ({
        ...prevState,
        menuApp: menu,
      }));
    }
  }

  returnToHome = () => {
    const { history } = this.props;
    if (history) {
      history.go('/');
    }
  };

  render() {
    const { processLogout, language, userInfo } = this.props;

    const firstName = userInfo?.firstName;
    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>

        {/* <div
          className="Home"
          onClick={this.returnToHome}
          style={{ cursor: 'pointer' }}
        >
          <h3>React</h3>
        </div> */}
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
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (lan) => dispatch(actions.changeLanguageApp(lan)),
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
