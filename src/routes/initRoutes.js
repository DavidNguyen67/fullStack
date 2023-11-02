const express = require('express');
const router = express.Router();

const initWebRoutes = (app) => {
  // define the home page route
  router.get('/', (req, res) => {
    res.render('index.ejs');
  });
  // define the about route
  router.get('/about', (req, res) => {
    res.send('About birds');
  });
  return app.use('/', router);
};
export default initWebRoutes;
