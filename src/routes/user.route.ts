import { Router } from 'express';
import { getLogin, postLogin, getRegister, postRegister, logout, getProfile, updateProfile, getAdminUsers, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticateToken, restrictTo } from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/login', getLogin);
userRouter.post('/login', postLogin);
userRouter.get('/register', getRegister);
userRouter.post('/register', postRegister);
userRouter.get('/logout', logout);
userRouter.get('/profile', authenticateToken, getProfile);
userRouter.post('/profile', authenticateToken, updateProfile);
userRouter.get('/admin', authenticateToken, getAdminUsers);
userRouter.post('/update/:userId', authenticateToken, restrictTo(1), updateUser);
userRouter.post('/delete/:userId', authenticateToken, restrictTo(1), deleteUser);

export default userRouter;