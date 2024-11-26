import { Router } from 'express';
import {
    getAllPrivateCommunities,
    getPrivateCommunityById,
    createPrivateCommunity,
    updatePrivateCommunity,
    deletePrivateCommunity,
} from '../controllers/private_communities_controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Rutas privadas para las comunidades
router.get('/', verifyToken, getAllPrivateCommunities);
router.get('/:id', verifyToken, getPrivateCommunityById);
router.post('/', verifyToken, createPrivateCommunity);
router.put('/:id', verifyToken, updatePrivateCommunity);
router.delete('/:id', verifyToken, deletePrivateCommunity);

export default router;
