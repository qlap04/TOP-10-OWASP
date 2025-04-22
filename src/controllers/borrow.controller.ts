import { Request, Response } from 'express';
import * as borrowService from '../services/borrow.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getBorrowRequests = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const roleId = req.user!.roleId;
        let borrows = [];
        let approvedBorrows = [];
        let rejectedBorrows = [];
        if (roleId === 2) {
            approvedBorrows = await borrowService.getApprovedBorrows(userId);
            rejectedBorrows = await borrowService.getRejectedBorrows(userId);
        } else {
            borrows = await borrowService.getBorrowRequests(userId, roleId);
        }
        res.render('pages/borrows', {
            title: 'Yêu cầu Mượn',
            user: req.user,
            borrows,
            approvedBorrows,
            rejectedBorrows,
            error: null
        });
    } catch (error: any) {
        res.render('pages/borrows', {
            title: 'Yêu cầu Mượn',
            user: req.user,
            borrows: [],
            approvedBorrows: [],
            rejectedBorrows: [],
            error: error.message
        });
    }
};

export const getAdminBorrows = async (req: AuthRequest, res: Response) => {
    try {
        const borrows = await borrowService.getBorrowRequests(req.user!.id, req.user!.roleId);
        res.render('pages/admin-borrows', {
            title: 'Quản lý Yêu cầu Mượn',
            user: req.user,
            borrows,
            error: null
        });
    } catch (error: any) {
        res.render('pages/admin-borrows', {
            title: 'Quản lý Yêu cầu Mượn',
            user: req.user,
            borrows: [],
            error: error.message
        });
    }
};

export const createBorrowRequest = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { bookId, quantity } = req.body;
        const books = [{ bookId, quantity: Number(quantity) }];
        await borrowService.createBorrowRequest(userId, books);
        res.redirect('/borrows');
    } catch (error: any) {
        res.render('pages/borrows', {
            title: 'Yêu cầu Mượn',
            user: req.user,
            borrows: [],
            approvedBorrows: [],
            rejectedBorrows: [],
            error: error.message
        });
    }
};

export const updateBorrowStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { borrowId } = req.params;
        const { status } = req.body;
        await borrowService.updateBorrowStatus(borrowId, status);
        res.redirect('/borrows/admin');
    } catch (error: any) {
        res.render('pages/admin-borrows', {
            title: 'Quản lý Yêu cầu Mượn',
            user: req.user,
            borrows: [],
            error: error.message
        });
    }
};

export const deleteBorrowRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { borrowId } = req.params;
        const roleId = req.user!.roleId;
        if (roleId !== 1 && roleId !== 3) {
            throw new Error('Chỉ Admin hoặc Thủ thư được xóa yêu cầu mượn');
        }
        await borrowService.deleteBorrowRequest(borrowId);
        res.redirect('/borrows/admin');
    } catch (error: any) {
        res.render('pages/admin-borrows', {
            title: 'Quản lý Yêu cầu Mượn',
            user: req.user,
            borrows: [],
            error: error.message
        });
    }
};