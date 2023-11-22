import React from 'react';
import {
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
  MDBTypography,
  MDBValidation,
  MDBValidationItem,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBCard,
} from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';

class SignUpForm extends React.Component<{ width: string }> {
  render(): React.ReactNode {
    return (
      <MDBValidation className={`${this.props.width} mx-auto`}>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-white my-5 mx-auto"
              style={{ borderRadius: '1rem', maxWidth: '500px' }}
            >
              <MDBCardBody className="p-5 w-100 d-flex flex-column">
                <MDBValidationItem className="col-12">
                  <h2 className="fw-bold mb-2 text-center">Sign up</h2>
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <MDBInput
                    wrapperClass="mb-4 w-100"
                    label="Email address"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    required
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <MDBInput
                    wrapperClass="mb-4 w-100"
                    label="Password"
                    id="formControlLg"
                    type="password"
                    size="lg"
                    required
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <MDBInput
                    wrapperClass="mb-4 w-100"
                    label="Confirm Password"
                    id="formControlLg"
                    type="password"
                    size="lg"
                    required
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <div className="d-flex justify-content-center mb-2">
                    <MDBValidationItem
                      className="col-12"
                      feedback="You must agree before submitting."
                      invalid
                    >
                      <MDBCheckbox
                        name="flexCheck"
                        value=""
                        id="flexCheckDefault"
                        label="Subscribe to our newsletter"
                        required
                      />
                    </MDBValidationItem>
                  </div>
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <NavLink to={'/login'}>
                    <MDBTypography
                      className="text-center"
                      style={{ color: '#3b71ca', cursor: 'pointer' }}
                    >
                      Already has an account ?
                    </MDBTypography>
                  </NavLink>
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <div className="mb-2"></div>
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <MDBBtn className="w-100 mb-4" size="lg">
                    Sign up
                  </MDBBtn>
                </MDBValidationItem>
                <MDBValidationItem className="col-12">
                  <div className="text-center">
                    <p>or sign up with:</p>
                    <div
                      className="d-flex justify-content-between mx-auto"
                      style={{ width: '40%' }}
                    >
                      <MDBBtn
                        tag="a"
                        color="none"
                        className="mx-3"
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
export default SignUpForm;
