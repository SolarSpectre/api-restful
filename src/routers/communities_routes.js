import { Router } from 'express';
import {
    getAllCommunities,
    getCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
} from '../controllers/communities_controller.js';

const router = Router();

// Rutas para las comunidades
router.get('/', getAllCommunities);
router.get('/:id', getCommunityById);
router.post('/', createCommunity);
router.put('/:id', updateCommunity);
router.delete('/:id', deleteCommunity);

export default router;
