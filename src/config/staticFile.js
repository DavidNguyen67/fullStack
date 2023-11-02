import express from 'express';
import path from 'path';

const configStaticFile = (app) => {
  app.use(express.static(path.join(__dirname, './../public')));
};

export default configStaticFile;
