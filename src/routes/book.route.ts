import { Router } from 'express';
import { getBooks, getAddBook, addBook, getEditBook, updateBook, deleteBook, searchBooks } from '../controllers/book.controller';
import { authenticateToken, restrictTo } from '../middlewares/auth.middleware';

const bookRouter = Router();

bookRouter.get('/', getBooks);
bookRouter.get('/search', searchBooks);
bookRouter.get('/add', authenticateToken, restrictTo(1, 3), getAddBook);
bookRouter.post('/', authenticateToken, restrictTo(1, 3), addBook);
bookRouter.get('/edit/:bookId', authenticateToken, restrictTo(1, 3), getEditBook);
bookRouter.post('/:bookId', authenticateToken, restrictTo(1, 3), updateBook);
bookRouter.post('/delete/:bookId', authenticateToken, restrictTo(1, 3), deleteBook);

export default bookRouter;