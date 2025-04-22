import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './shared/config/db.config';
import userRouter from './routes/user.route';
import bookRouter from './routes/book.route';
import borrowRouter from './routes/borrow.route';
import { Response, Request, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from './models/user.model';
import expressLayouts from 'express-ejs-layouts';

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// A05: Security Misconfiguration - CORS lỏng lẻo, tắt CSP
app.use(cors({ origin: '*', credentials: true }));
app.use(helmet({ contentSecurityPolicy: false }));

// Cấu hình EJS và express-ejs-layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware để kiểm tra user cho mọi request
app.use(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (token) {
        try {
            const payload = jwt.verify(token, 'weak-secret') as { id: string; roleId: number };
            const user = await User.findById(payload.id).select('username email roleId');
            res.locals.user = user || null;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// Kết nối DB
connectDB();


// Routes
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/borrows', borrowRouter);

// Routes
app.get('/', async (req: Request, res: Response) => {
    res.render('pages/index', { title: 'Quản lý Thư viện' });
});

// Middleware xử lý 404 - Lộ stack trace
app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Cannot ${req.method} ${req.url}`);
    (err as any).status = 404;
    next(err);
});

// A09: Security Logging and Monitoring Failures - Lộ stack trace
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(`<h1>Error: ${err.stack}</h1>`);
});

// Trang chủ
app.get('/', async (req: Request, res: Response) => {
    res.render('pages/index', { title: 'Quản lý Thư viện' });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});