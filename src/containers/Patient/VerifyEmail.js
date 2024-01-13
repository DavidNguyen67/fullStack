import React, { Component } from 'react';
import { connect } from 'react-redux';
import { verifyAppointment } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss';
import { LANGUAGES } from '../../utils';

const TIME_OUT = 5000;
let setTimeOutVar;

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVerify: false,
      isLoading: false,
      isFailed: false,
    };
  }

  async componentDidMount() {
    const queryString = new URLSearchParams(this.props.location.search).get(
      'token'
    );
    if (queryString) {
      this.setState((prevState) => ({
        ...prevState,
        isLoading: true,
        isVerify: false,
        isFailed: false,
      }));
      const response = await verifyAppointment(queryString);
      if (response) {
        if (response.statusCode === 200) {
          this.setState((prevState) => ({
            ...prevState,
            isVerify: true,
            isFailed: false,
            isLoading: false,
          }));
          setTimeOutVar = setTimeout(() => {
            this.props.history.push('/');
          }, TIME_OUT);
          return;
        }
        if (response.statusCode === 404) {
          this.setState((prevState) => ({
            ...prevState,
            isVerify: false,
            isFailed: true,
            isLoading: false,
          }));
          return;
        }
        if (response.status === 500) {
          this.setState((prevState) => ({
            ...prevState,
            isVerify: false,
            isFailed: true,
            isLoading: false,
          }));
          return;
        }
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(setTimeOutVar);
  }

  render() {
    const { isVerify, isLoading, isFailed } = this.state;
    const { lang } = this.props;
    return (
      <>
        <HomeHeader />
        <div className="verify-email-booking">
          <br />
          <h4 className="info mt-4">
            {lang === LANGUAGES.VI ? (
              <>
                {isLoading && <>Dang loading</>}
                {isFailed && <>Xac dinh lich hen bi loi</>}
                {isVerify && <>Xac dinh lich hen thanh cong</>}
              </>
            ) : (
              <>
                {isLoading && <>loading</>}
                {isFailed && <>Failed for verify</>}
                {isVerify && <>Verify successfully</>}
              </>
            )}
          </h4>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
