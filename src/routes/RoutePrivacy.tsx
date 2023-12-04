import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from '../components/authForm/LoginForm';
import SignUpForm from '../components/authForm/SignUpForm';
import Home from '../components/home/Home';
import WelcomePage from '../components/introductory/WelcomePage';
import Temp from '../components/testComponent/temp';
// import { lazy } from 'react';

// const WelcomePage = lazy(
//   () => import('../components/introductory/WelcomePage')
// );
class RoutePrivacy extends React.Component {
  render(): React.ReactNode {
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="*" element={<Temp />} />
      </Routes>
    );
  }
}
export default RoutePrivacy;
