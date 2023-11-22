import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from '../components/authForm/LoginForm';
import SignUpForm from '../components/authForm/SignUpForm';
import Home from '../components/home/Home';

class RoutePrivacy extends React.Component {
  render(): React.ReactNode {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignUpForm />} />
      </Routes>
    );
  }
}
export default RoutePrivacy;
