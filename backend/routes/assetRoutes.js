import express from 'express';

import {
  getAssets,
  createAsset,
  allocateAsset,
  returnAsset
} from '../controllers/assetController.js';

const router = express.Router();

router.get('/', getAssets);

router.post('/', createAsset);

router.post('/allocate', allocateAsset);

router.put('/return/:id', returnAsset);

export default router;