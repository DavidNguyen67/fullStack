import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomeFooter extends Component {
  changeLanguage = (lan) => {
    this.props.changeLanguageAppRedux(lan);
  };

  render() {
    return (
      <div className="home-footer text-center">
        <p>&copy;{new Date().getFullYear()} David Nguyen</p>
      </div>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
