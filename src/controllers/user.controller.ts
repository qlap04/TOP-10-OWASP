import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { IUser } from '@/models/user.model';
export const getLogin = (req: Request, res: Response) => {
    res.render('pages/login', { title: 'Đăng nhập', error: null, user: null });
};

export const postLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await userService.loginUser(email, password);
        res.cookie('accessToken', accessToken);
        res.cookie('refreshToken', refreshToken);
        res.redirect('/books');
    } catch (error: any) {
        res.render('pages/login', { title: 'Đăng nhập', error: error.message, user: null });
    }
};

export const getRegister = (req: Request, res: Response) => {
    res.render('pages/register', { title: 'Đăng ký', error: null, user: null });
};

export const postRegister = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        await userService.registerUser(username, email, password);
        res.redirect('/users/login');
    } catch (error: any) {
        res.render('pages/register', { title: 'Đăng ký', error: error.message, user: null });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('/users/login');
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await userService.getUserById(req.user!.id);
        res.render('pages/profile', { title: 'Hồ sơ', user, error: null });
    } catch (error: any) {
        res.redirect('/users/login');
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const callerRoleId = req.user!.roleId; // Lấy roleId của người gọi
        const { bio, roleId } = req.body;
        const data: Partial<IUser> = { bio };
        if (roleId) {
            data.roleId = Number(roleId);
        }
        const user = await userService.updateProfile(userId, data, callerRoleId);
        res.render('pages/profile', { title: 'Hồ sơ', user, error: null });
    } catch (error: any) {
        const user = await userService.getUserById(req.user!.id);
        res.render('pages/profile', { title: 'Hồ sơ', user, error: error.message });
    }
};

export const getAdminUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.render('pages/admin-users', { title: 'Quản trị - Quản lý Người dùng', user: req.user, users, error: null });
    } catch (error: any) {
        res.render('pages/admin-users', { title: 'Quản trị - Quản lý Người dùng', user: req.user, users: [], error: error.message });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const data = req.body;
        await userService.updateUser(userId, data);
        res.redirect('/users/admin');
    } catch (error: any) {
        res.render('pages/admin-users', { title: 'Quản trị - Quản lý Người dùng', user: req.user, users: [], error: error.message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        await userService.deleteUser(userId);
        res.redirect('/users/admin');
    } catch (error: any) {
        res.render('pages/admin-users', { title: 'Quản trị - Quản lý Người dùng', user: req.user, users: [], error: error.message });
    }
};