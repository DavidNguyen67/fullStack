import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from './../../assets/bookingCare.svg';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from './../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';

class HomeHeader extends Component {
  changeLanguage = (lan) => {
    this.props.changeLanguageAppRedux(lan);
  };

  render() {
    const { language } = this.props;
    return (
      <>
        <div className="home-header-container container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <div className="mx-1" />
              <img src={logo} alt="" />
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={'home-header.specialty'} />
                  </b>
                </div>
                <div>
                  <FormattedMessage id={'home-header.search-doctor'} />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={'home-header.health-facility'} />
                  </b>
                </div>
                <div>
                  <FormattedMessage id={'home-header.select-room'} />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={'home-header.doctor'} />
                  </b>
                </div>
                <div>
                  <FormattedMessage id={'home-header.select-doctor'} />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={'home-header.fee'} />
                  </b>
                </div>
                <div>
                  <FormattedMessage id={'home-header.check-health'} />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <FormattedMessage id={'home-header.support'} />
                <div
                  className={
                    language.toLowerCase() === LANGUAGES.VI.toLowerCase()
                      ? 'language-vi active'
                      : 'language-vi'
                  }
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                    VN
                  </span>
                </div>
                <div
                  className={
                    language.toLowerCase() === LANGUAGES.EN.toLowerCase()
                      ? 'language-en active'
                      : 'language-en'
                  }
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                    EN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="home-header-banner">
          <div className="content-up">
            <div className="title1">
              <FormattedMessage id={'banner.title1'} />
            </div>
            <div className="title2">
              <FormattedMessage id={'banner.title2'} />
            </div>
            <div className="search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder={`${(
                  <FormattedMessage id={'search.placeholder'} />
                )}`}
              />
            </div>
          </div>
          <div className="content-down">
            <div className="options">
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id={'banner.child1'} />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id={'banner.child2'} />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-bed"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id={'banner.child3'} />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-flask"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id={'banner.child4'} />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-user-md"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id={'banner.child5'} />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-briefcase-medical"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id={'banner.child6'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (lan) => dispatch(changeLanguageApp(lan)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
