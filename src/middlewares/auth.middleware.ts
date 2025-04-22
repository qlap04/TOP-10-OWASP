import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { id: string; roleId: number };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.redirect('/users/login');
    }

    jwt.verify(token, 'weak-secret', (err: any, user: any) => {
        if (err) {
            return res.redirect('/users/login');
        }
        (req as AuthRequest).user = user;
        next();
    });
};

export const restrictTo = (...allowedRoles: number[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.roleId)) {
            res.status(403).render('pages/error', { title: 'Forbidden', user: req.user, error: 'Access denied' });
            return;
        }
        next();
    };
};