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
} from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';

class LoginForm extends React.Component<{ width: string }> {
  render(): React.ReactNode {
    return (
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{ borderRadius: '1rem', maxWidth: '500px' }}
          >
            <MDBCardBody className="p-5 w-100 d-flex flex-column">
              {/* <MDBValidationItem className="col-12"> */}
              <Typography variant="h2" className="fw-bold mb-2 text-center">
                Sign In
              </Typography>
              {/* </MDBValidationItem> */}
              <MDBValidationItem
                className="col-12"
                feedback="This field is required"
                invalid
              >
                <MDBInput
                  required
                  size="lg"
                  id="formControlLg"
                  label="Email address"
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
                  id="formControlLg"
                  type="password"
                  size="lg"
                  required
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
                <MDBTypography style={{ color: '#3b71ca', cursor: 'pointer' }}>
                  Forgot password
                </MDBTypography>
              </div>
              <MDBValidationItem className="col-12">
                <MDBBtn size="lg" className="col-12">
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
    );
  }
}

export default LoginForm;
