import { Switch, Route, Redirect } from 'react-router-dom';
// import App from '../app/App';
import MenuBar from '../navbar/Menu';
import {
  pathDropDownElements,
  pathElements,
} from '../../utils/templatePathRoutes';
import { Container, Row } from 'react-bootstrap';

const Web = () => {
  const mergedPath = pathDropDownElements.concat(pathElements);
  return (
    <>
      <MenuBar />
      <Container>
        <Row>
          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            {mergedPath.map((path) => {
              return (
                <Route key={path.path} path={`/${path.path}`}>
                  {path?.components}
                </Route>
              );
            })}
          </Switch>
        </Row>
      </Container>
    </>
  );
};
export default Web;
