// import React from 'react';
import React from 'react';
import './../../style/App.css';
import { Col, Container, Row } from 'react-bootstrap';
import RoutePrivacy from '../../routes/RoutePrivacy';
class App extends React.Component {
  render() {
    return (
      <Container fluid="md">
        <Row>
          <Col>
            <RoutePrivacy />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
