import bodyParser from 'body-parser';
import configEngine from './viewEngine';
import configStaticFile from './staticFile';

const configApp = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  configEngine(app);
  configStaticFile(app);
};

export default configApp;
