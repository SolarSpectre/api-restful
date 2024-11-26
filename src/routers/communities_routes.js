import { Router } from 'express';
import {
    getAllCommunities,
    getCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
} from '../controllers/communities_controller.js';
import { verifyToken } from '../middlewares/auth.js'

const router = Router();

// Rutas para las comunidades
router.get('/', getAllCommunities);
router.get('/:id', getCommunityById);
router.post('/',verifyToken, createCommunity);
router.put('/:id',verifyToken, updateCommunity);
router.delete('/:id',verifyToken, deleteCommunity);

export default router;
