import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RecaptchaV2 } from 'express-recaptcha';
export interface AuthRequest extends Request {
    user?: { id: string; roleId: number };
}
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.accessToken;

    // Lấy token từ header Authorization nếu không có trong cookie
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // Lấy token từ "Bearer <token>"
    }

    if (!token) {
        return res.redirect('/users/login');
    }

    // Sử dụng jwt.decode thay vì jwt.verify
    try {
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            return res.redirect('/users/login');
        }
        (req as AuthRequest).user = decoded.payload;
        next();
    } catch (error) {
        return res.redirect('/users/login');
    }
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

export const recaptcha = new RecaptchaV2('6LeSTjMrAAAAALEWLhBDVD4d8WbkjJ36CItkZevZ', '6LeSTjMrAAAAAEoEqA67-iBKxcy7h73jhaDzC2as');

// Middleware kiểm tra CAPTCHA
export const verifyCaptcha = (req: Request, res: Response, next: NextFunction): void => {
    recaptcha.middleware.verify(req, res, (err: string | null) => {
        if (err) {
            return res.status(400).render('pages/login', {
                title: 'Đăng nhập',
                error: 'Xác minh CAPTCHA thất bại!'
            });
        }
        next();
    });
};

