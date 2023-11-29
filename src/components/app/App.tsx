// import React from 'react';
import React from 'react';
import './../../style/App.css';
import { Col, Container, Row } from 'react-bootstrap';
import RoutePrivacy from '../../routes/RoutePrivacy';
import { ToastContainer } from 'react-toastify';
import DrawerAppBar from '../appbar/Appbar';
import { Toaster } from 'react-hot-toast';
class App extends React.Component {
  render() {
    return (
      <>
        <Container fluid="md">
          <DrawerAppBar />
          <br />
          <br />
          <br />
          <br />
          <Row>
            <Col>
              <RoutePrivacy />
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </Col>
          </Row>
        </Container>
        <Toaster position="top-center" reverseOrder={true} />
      </>
    );
  }
}

export default App;
