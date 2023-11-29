import React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Grid from '@mui/joy/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import {
  MDBBtn,
  MDBCheckbox,
  MDBIcon,
  MDBValidation,
  MDBValidationItem,
} from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';
class SignUpForm extends React.Component {
  state = {
    value: '',
  };
  handleChange = (event: any) => {
    this.setState({ value: event.target.value });
    console.log(this.state.value);
  };

  render(): React.ReactNode {
    return (
      <>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid xs={10} md={6} lg={4} sx={{ margin: 'auto' }}>
            <MDBValidation>
              <Card className="h-100">
                <NavLink to={'/login'} className="d-flex">
                  <Button variant="outlined" className="ms-auto">
                    Login
                    <LoginIcon />
                  </Button>
                </NavLink>
                <Typography variant="h3" className="fw-bold mb-2 text-center">
                  Register
                </Typography>
                <CardContent orientation="horizontal" sx={{ display: 'block' }}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                  />
                  <div className="my-2"></div>
                  <TextField
                    label="Password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                  />
                  <div className="my-2"></div>
                  <TextField
                    label="Confirm Password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                  />
                  <div className="my-2"></div>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">Gender</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={this.state.value}
                      label="Gender"
                      onChange={this.handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                  <div className="my-2"></div>
                  <TextField
                    label="Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <div className="my-2"></div>
                  <TextField
                    label="Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <div className="my-2"></div>
                  <div className="d-flex">
                    <FormControl sx={{ width: '48%' }} size="small">
                      <InputLabel id="demo-select-small-label">
                        TypeId
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={this.state.value}
                        label="TypeId"
                        onChange={this.handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      sx={{ width: '48%', marginLeft: 'auto' }}
                      size="small"
                    >
                      <InputLabel id="demo-select-small-label">
                        PositionId
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={this.state.value}
                        label="PositionId"
                        onChange={this.handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="my-2"></div>
                  <TextField
                    label="Avatar"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <div className="my-2"></div>
                  <MDBValidationItem
                    className="col-12"
                    feedback="You must agree before submitting."
                    invalid
                  >
                    <MDBCheckbox
                      label="Agree to terms and conditions"
                      id="invalidCheck"
                      required
                    />
                  </MDBValidationItem>
                  <div className="my-2"></div>
                </CardContent>
                <MDBBtn type="submit">Submit form</MDBBtn>
                <div className="text-center">
                  <p>or sign up with:</p>
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
                    className="mx-3"
                    style={{ color: '#1266f1' }}
                  >
                    <MDBIcon fab icon="twitter" size="sm" />
                  </MDBBtn>
                  <MDBBtn
                    tag="a"
                    color="none"
                    className="mx-3"
                    style={{ color: '#1266f1' }}
                  >
                    <MDBIcon fab icon="google" size="sm" />
                  </MDBBtn>
                  <MDBBtn
                    tag="a"
                    color="none"
                    className="mx-3"
                    style={{ color: '#1266f1' }}
                  >
                    <MDBIcon fab icon="github" size="sm" />
                  </MDBBtn>
                </div>
              </Card>
            </MDBValidation>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default SignUpForm;
