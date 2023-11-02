import express from 'express';
import configApp from './config/initApp';
import 'dotenv/config';
import initWebRoutes from './routes/initRoutes';

const app = express();
configApp(app);
initWebRoutes(app);

const PORT = process.env.PORT || 4040;
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => {
  console.log('server up and running');
});
