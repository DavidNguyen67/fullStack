import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import ProductManage from '../containers/System/ProductManage';
import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';
import Header from '../containers/Header/Header';
import ActionUserPage from '../containers/System/Admin/ActionUserPage';
import ManageDoctor from './../containers/System/Admin/ManageDoctor';
import ManageSpecialty from './../containers/System/Specialty/ManageSpecialty';
class System extends Component {
  render() {
    const { systemMenuPath, isLoggedIn } = this.props;
    return (
      <>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <div className="container">
              <Switch>
                <Route path="/system/users" exact component={UserManage} />
                <Route
                  path="/system/users/copy:id"
                  component={ActionUserPage}
                />
                <Route
                  path="/system/users/update:id"
                  component={ActionUserPage}
                />
                <Route
                  path="/system/users/delete:id"
                  component={ActionUserPage}
                />
                {/* <Route path="/system/users-redux" component={ActionUserPage} /> */}
                <Route path="/system/doctors" exact component={ManageDoctor} />
                <Route
                  path="/system/product-manage"
                  component={ProductManage}
                />
                <Route path="/system/specialties" component={ManageSpecialty} />
                <Route
                  path="/system/register-package-group-or-account"
                  component={RegisterPackageGroupOrAcc}
                />
                <Route
                  path="*"
                  component={() => {
                    return <Redirect to={systemMenuPath} />;
                  }}
                />
              </Switch>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
