import express from 'express';
import * as borrowController from '../controllers/borrow.controller';
import { authenticateToken, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticateToken);
router.get('/', borrowController.getBorrowRequests);
router.get('/admin', restrictTo(1, 3), borrowController.getAdminBorrows);
router.post('/', restrictTo(2), borrowController.createBorrowRequest);
router.post('/:borrowId', restrictTo(1, 3), borrowController.updateBorrowStatus);
router.post('/delete/:borrowId', restrictTo(1, 3), borrowController.deleteBorrowRequest);

export default router;