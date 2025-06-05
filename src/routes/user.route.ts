import { Router } from 'express';
import { getLogin, postLogin, getRegister, postRegister, logout, getProfile, updateProfile, getAdminUsers, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticateToken, restrictTo, verifyCaptcha } from '../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const userRouter = Router();

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 phút
    max: 5, // Giới hạn 5 lần thử
    message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 5 phút.'
});

userRouter.get('/login', getLogin);
userRouter.post('/login', loginLimiter, verifyCaptcha, postLogin);
// userRouter.post('/login', postLogin);
userRouter.get('/register', getRegister);
userRouter.post('/register', postRegister);
userRouter.get('/logout', logout);
userRouter.get('/profile', authenticateToken, getProfile);
userRouter.post('/profile', authenticateToken, updateProfile);
userRouter.get('/admin', authenticateToken, restrictTo(1), getAdminUsers);
// userRouter.get('/admin', authenticateToken, getAdminUsers);
userRouter.post('/update/:userId', authenticateToken, restrictTo(1), updateUser);
userRouter.post('/delete/:userId', authenticateToken, restrictTo(1), deleteUser);

export default userRouter;