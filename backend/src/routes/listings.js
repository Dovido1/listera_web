import express from 'express';
import {
  getListings,
  createListing,
  getListing,
  updateListing,
  deleteListing,
  publishListing,
  syncListings,
} from '../controllers/listingController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes listings sont protégées par JWT
router.use(authMiddleware);

// GET  /api/listings         → toutes les annonces
router.get('/', getListings);

// POST /api/listings         → créer une annonce
router.post('/', createListing);

// POST /api/listings/sync    → synchroniser toutes les annonces
router.post('/sync', syncListings);

// GET  /api/listings/:id     → une annonce
router.get('/:id', getListing);

// PUT  /api/listings/:id     → modifier une annonce
router.put('/:id', updateListing);

// DELETE /api/listings/:id   → supprimer une annonce
router.delete('/:id', deleteListing);

// POST /api/listings/:id/publish → publier une annonce
router.post('/:id/publish', publishListing);

export default router;