// import dfd from "danfojs-node";

import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import appRouter from './src/app.router.js';

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use('/api', appRouter)

//start app
const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);
