import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from '../components/authForm/LoginForm';
import SignUpForm from '../components/authForm/SignUpForm';

class RoutePrivacy extends React.Component {
  render(): React.ReactNode {
    const colFormProps = {
      width: `col-10 col-md-8 col-lg-6`,
    };
    return (
      <Routes>
        <Route path="/login" element={<LoginForm {...colFormProps} />} />
        <Route path="/register" element={<SignUpForm {...colFormProps} />} />
      </Routes>
    );
  }
}
export default RoutePrivacy;
