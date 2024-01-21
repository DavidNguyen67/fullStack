import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';

class LikeAndShare extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  initFacebookSDK() {
    if (window.FB) {
      window.FB.XFBML.parse();
    }

    const { language } = this.props;
    const locale = language === LANGUAGES.VI ? 'vi_VN' : 'en_US';
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true, // enable cookies to allow the server to access
        xfbml: true, // parse social plugins on this page
        version: 'v2.5', // use version 2.1
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  componentDidMount() {
    this.initFacebookSDK();
  }
  render() {
    const { dataHref, width } = this.props;
    return (
      <>
        <div
          class="fb-like"
          data-href={dataHref}
          data-width={width || ''}
          data-layout=""
          data-action=""
          data-size=""
          data-share="true"
        ></div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LikeAndShare);
