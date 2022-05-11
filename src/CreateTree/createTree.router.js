import express from 'express';
const router = express.Router();

import {createTreeService} from './createTree.service.js';

router.post('/', createTreeService);

export default router;