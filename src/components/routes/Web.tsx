import { Switch, Route, Redirect } from 'react-router-dom';
// import App from '../app/App';
import MenuBar from '../navbar/Menu';
import {
  pathDropDownElements,
  pathElements,
} from '../../utils/templatePathRoutes';
import { Container, Row } from 'react-bootstrap';
import { keyRootReducers, useAppSelector } from '../../redux';
import './../../style/mainSlide.scss';
import { productsFetchOne } from '../../utils/routeApi';
import Product from '../product/Product';

const Web = () => {
  const mergedPath = pathDropDownElements.concat(pathElements);
  const { error } = useAppSelector((state: keyRootReducers) => state.slide);

  return (
    <>
      {error ? (
        <div className="internalServerError-Container">internalServerError</div>
      ) : (
        <>
          <MenuBar />
          <Container>
            <Row>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
                <Route path={`${productsFetchOne}`}>
                  <Product />
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
      )}
    </>
  );
};
export default Web;
