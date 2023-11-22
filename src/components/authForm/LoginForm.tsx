import React from 'react';
import {
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
  MDBTypography,
  MDBValidationItem,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBValidation,
} from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import { connect } from 'react-redux';
import {
  fillPasswordLogin,
  fillEmailLogin,
  login,
} from '../../redux/actions/authActions';
import { Navigate } from 'react-router-dom';

interface AuthActions {
  fillPasswordLogin: (payload: string) => void;
  fillEmailLogin: (payload: string) => void;
  login: () => void;
  auth: {
    email: string;
    password: string;
  };
}

class LoginForm extends React.Component<AuthActions> {
  handleSubmitAuthForm = (): void => {
    if (this.props.auth.email && this.props.auth.password) {
      this.props.login();
      <Navigate to="/" replace={false} />;
    }
  };
  handleFillPasswordForm = (event: any): void => {
    this.props.fillPasswordLogin(event.target.value.trim());
  };
  handleFillEmailForm = (event: any): void => {
    this.props.fillEmailLogin(event.target.value.trim());
  };
  render(): React.ReactNode {
    return (
      <MDBValidation>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-white my-5 mx-auto"
              style={{ borderRadius: '1rem', maxWidth: '500px' }}
            >
              <MDBCardBody className="p-5 w-100 d-flex flex-column">
                <Typography variant="h2" className="fw-bold mb-2 text-center">
                  Sign In
                </Typography>
                <MDBValidationItem
                  className="col-12"
                  feedback="This field is required"
                  invalid
                >
                  <MDBInput
                    required
                    size="lg"
                    label="Email address"
                    value={this.props.auth.email}
                    onChange={this.handleFillEmailForm}
                  />
                </MDBValidationItem>
                <div className="my-2"></div>
                <MDBValidationItem
                  className="col-12"
                  feedback="This field is required"
                  invalid
                >
                  <MDBInput
                    wrapperClass="mb-4 w-100"
                    label="Password"
                    type="password"
                    size="lg"
                    required
                    value={this.props.auth.password}
                    onChange={this.handleFillPasswordForm}
                  />
                </MDBValidationItem>
                <div className="d-flex justify-content-between mx-3 my-1">
                  <MDBCheckbox
                    name="flexCheck"
                    value=""
                    id="flexCheckDefault"
                    label="Remember me"
                    required={false}
                  />
                  <MDBTypography
                    style={{ color: '#3b71ca', cursor: 'pointer' }}
                  >
                    Forgot password
                  </MDBTypography>
                </div>
                <MDBValidationItem className="col-12">
                  <MDBBtn
                    size="lg"
                    className="col-12"
                    type="submit"
                    onClick={this.handleSubmitAuthForm}
                    disabled={
                      !this.props.auth.email || !this.props.auth.password
                    }
                  >
                    Login
                  </MDBBtn>
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <hr className="my-4" />
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <div className="text-center">
                    <div className="d-flex justify-content-center">
                      Not a member?
                      <NavLink to={'/register'}>
                        <MDBTypography
                          style={{ color: '#3b71ca', cursor: 'pointer' }}
                        >
                          Register
                        </MDBTypography>
                      </NavLink>
                    </div>
                    <p>or sign up with:</p>
                    <div
                      className="d-flex justify-content-between mx-auto"
                      style={{ width: '40%' }}
                    >
                      <MDBBtn
                        tag="a"
                        color="none"
                        className="m-1"
                        style={{ color: '#1266f1' }}
                      >
                        <MDBIcon fab icon="facebook-f" size="sm" />
                      </MDBBtn>
                      <MDBBtn
                        tag="a"
                        color="none"
                        className="m-1"
                        style={{ color: '#1266f1' }}
                      >
                        <MDBIcon fab icon="twitter" size="sm" />
                      </MDBBtn>

                      <MDBBtn
                        tag="a"
                        color="none"
                        className="m-1"
                        style={{ color: '#1266f1' }}
                      >
                        <MDBIcon fab icon="google" size="sm" />
                      </MDBBtn>

                      <MDBBtn
                        tag="a"
                        color="none"
                        className="m-1"
                        style={{ color: '#1266f1' }}
                      >
                        <MDBIcon fab icon="github" size="sm" />
                      </MDBBtn>
                    </div>
                  </div>
                </MDBValidationItem>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBValidation>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fillPasswordLogin: (payload: string) =>
      dispatch(fillPasswordLogin(payload)),
    fillEmailLogin: (payload: string) => dispatch(fillEmailLogin(payload)),
    login: () => dispatch(login()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
