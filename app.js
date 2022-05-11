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


// const exampleLinks = [
//   { name: "Сп1", data: [0, 0, 0, 0, 1] },
//   { name: "Сп2", data: [0, 0, 0, 1, 0] },
//   { name: "Сп3", data: [0, 0, 1, 0, 0] },
//   { name: "Сп4", data: [0, 1, 0, 0, 0] },
//   { name: "Сп5", data: [0, 0, 0, 1, 1] },
//   { name: "Сп6", data: [0, 0, 0, 1, 1] },
//   { name: "Сп7", data: [0, 0, 1, 1, 0] },
//   { name: "Сп8", data: [0, 0, 1, 1, 0] },
//   { name: "Сп9", data: [0, 1, 1, 1, 1] },
//   { name: "Сп10", data: [0, 1, 1, 1, 1] },
//   { name: "Сп11", data: [0, 1, 1, 1, 1] },
//   { name: "Сп12", data: [0, 1, 1, 1, 1] },
//   { name: "Сп13", data: [0, 1, 1, 1, 1] },
//   { name: "Сп14", data: [0, 1, 0, 1, 1] },
//   { name: "Сп15", data: [0, 1, 0, 1, 1] },
//   { name: "Сп16", data: [0, 1, 0, 1, 1] },
// ];

// console.log(
//   util.inspect(createOriginHistory(exampleLinks), { showHidden: false, depth: null, colors: true })
// );
