import express from 'express';
const appRouter = express.Router()
import createTreeRouter from './CreateTree/createTree.router.js';

appRouter.use('/createTree', createTreeRouter)
 
export default appRouter;