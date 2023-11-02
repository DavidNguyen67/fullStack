import path from 'path';

const configEngine = (app) => {
  app.set('views', path.join(__dirname, './../views'));
  app.set('view engine', 'ejs');
};

export default configEngine;
