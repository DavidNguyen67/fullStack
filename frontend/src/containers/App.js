import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux';
import { ToastContainer } from 'react-toastify';

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from '../hoc/authentication';

import { path } from '../utils';

import Home from '../routes/Home';
import Login from '../routes/Login';
import System from '../routes/System';
import HomePage from './HomePage/HomePage';
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import CustomScrollbars from '../components/CustomScrollbars';
import DetailDoctor from './Patient/Doctor/DetailDoctor';
import Doctor from '../routes/Doctor';
import VerifyEmail from './Patient/VerifyEmail';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import DetailClinic from './Patient/Clinic/DetailClinic';
import LoadingOverlay from 'react-loading-overlay-nextgen';
import BounceLoader from 'react-spinners/BounceLoader';
import { startLoading, stopLoading } from '../store/actions';
class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    const { isLoading } = this.props;
    return (
      <Fragment>
        <LoadingOverlay active={isLoading} spinner>
          <Router history={history}>
            <div className="main-container">
              <ConfirmModal />
              {/* {this.props.isLoggedIn && <Header />} */}
              <div className="content-container">
                <CustomScrollbars style={{ width: '100%', height: '100vh' }}>
                  <Switch>
                    <Route path={path.HOME} exact component={Home} />
                    <Route
                      path={path.LOGIN}
                      component={userIsNotAuthenticated(Login)}
                    />
                    <Route
                      path={path.SYSTEM}
                      component={userIsAuthenticated(System)}
                    />
                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                    <Route
                      path={path.DETAIL_SPECIALTY}
                      component={DetailSpecialty}
                    />
                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                    <Route
                      path={path.DOCTOR}
                      component={userIsAuthenticated(Doctor)}
                    />
                    <Route path={path.VERIFY} component={VerifyEmail} />
                    <Route path={path.HOMEPAGE} component={HomePage} />
                  </Switch>
                </CustomScrollbars>
              </div>

              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
              />
            </div>
          </Router>
        </LoadingOverlay>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoading: state.app.isLoading,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startLoading: () => dispatch(startLoading()),
    stopLoading: () => dispatch(stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);