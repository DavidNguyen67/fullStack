import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './../../style/menubar.scss';
import viteLogo from '/vite.svg';
import SettingsIcon from '@mui/icons-material/Settings';
import CustomizedSwitches from './settings/theme';
import Locales from './settings/lang';
import {
  pathDropDownElements,
  pathElements,
} from '../../utils/templatePathRoutes';
// import { keyRootReducers, useAppSelector } from '../../redux';
// import * as bootstrap from '../../utils/theme/bootstrap';
// import * as mui from './../../utils/theme/mui';

function MenuBar() {
  const intl = useIntl();
  // const { isDarkTheme } = useAppSelector(
  //   (state: keyRootReducers) => state.theme
  // );

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary menubar"
      // data-bs-theme={isDarkTheme ? bootstrap.darkNavBar : bootstrap.lightNavBar}
    >
      <Container>
        <NavDropdown
          title={
            <MenuIcon
              fontSize="large"
              // color={isDarkTheme ? mui.iconThemeDark : mui.iconThemeLight}
            />
          }
          // id="basic-nav-dropdown"
          className="navbar-icon"
        >
          {pathDropDownElements.map((path) => (
            <div key={path.path}>
              <Typography variant="body1" className="dropdown-item">
                <NavLink
                  className="nav-link position-relative hover"
                  style={{
                    borderBottom: 'rgba(238,238,238,1.00)',
                  }}
                  to={`${path.path}`}
                >
                  {intl.formatMessage({ id: `menu.dropdown.${path.path}` })}
                </NavLink>
              </Typography>
              <NavDropdown.Divider />
            </div>
          ))}

          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
        <NavLink className="navbar-brand ms-3 d-flex align-items-center" to="/">
          {<img src={viteLogo} className="brand" />}
          <Typography variant="h5" fontWeight="700">
            Vite
          </Typography>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex flex-lg-grow-1" id="mainMenu">
            {pathElements.map((path) => (
              <NavLink
                key={path.path}
                to={`${path.path}`}
                className="nav-link my-auto d-flex align-items-center position-relative hover"
              >
                {path?.icon}
                <Typography
                  variant="h6"
                  // sx={{ margin: '0 auto' }}
                  color={path?.variant}
                >
                  {intl.formatMessage({ id: `menu.${path.path}` })}
                </Typography>
              </NavLink>
            ))}
          </Nav>
          <NavDropdown
            title={
              <SettingsIcon
              // color={isDarkTheme ? mui.iconThemeDark : mui.iconThemeLight}
              />
            }
            id="basic-nav-dropdown"
            className="navbar-icon webSetting d-flex d-lg-block"
          >
            <CustomizedSwitches />
            <Locales />
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MenuBar;
