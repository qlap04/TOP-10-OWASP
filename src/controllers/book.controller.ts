import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import * as borrowService from '../services/borrow.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Types } from 'mongoose';

export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await bookService.getBooks();
        let borrowStatus: { bookId: string; status: string; quantity: number }[] = [];
        if (res.locals.user && res.locals.user.roleId === 2) {
            const borrows = await borrowService.getBorrowRequests(res.locals.user.id, 2);
            borrowStatus = books.map(book => {
                const borrow = borrows.find(borrow =>
                    borrow.status === 'approved' &&
                    borrow.books.some(b => {
                        // Xử lý bookId có thể là ObjectId hoặc đối tượng populate
                        const bookId = b.bookId instanceof Types.ObjectId ? b.bookId.toString() : (b.bookId as any)._id.toString();
                        return bookId === book._id.toString();
                    })
                );
                if (borrow) {
                    const borrowedBook = borrow.books.find(b => {
                        const bookId = b.bookId instanceof Types.ObjectId ? b.bookId.toString() : (b.bookId as any)._id.toString();
                        return bookId === book._id.toString();
                    });
                    return {
                        bookId: book._id.toString(),
                        status: 'Đã mượn',
                        quantity: borrowedBook ? borrowedBook.quantity : 0
                    };
                }
                return { bookId: book._id.toString(), status: 'Chưa mượn', quantity: 0 };
            });
        }
        res.render('pages/books', {
            title: 'Sách',
            books,
            borrowStatus,
            error: books.length === 0 ? 'Không tìm thấy sách' : null
        });
    } catch (error: any) {
        res.render('pages/books', {
            title: 'Sách',
            books: [],
            borrowStatus: [],
            error: error.message
        });
    }
};

export const getAddBook = (req: AuthRequest, res: Response) => {
    res.render('pages/add-book', { title: 'Thêm Sách', user: req.user, error: null });
};

export const addBook = async (req: AuthRequest, res: Response) => {
    try {
        const { bookId, title, author, description, coverUrl, quantity } = req.body;
        await bookService.addBook(bookId, title, author, description, coverUrl, Number(quantity));
        res.redirect('/books');
    } catch (error: any) {
        res.render('pages/add-book', { title: 'Thêm Sách', user: req.user, error: error.message });
    }
};

export const getEditBook = async (req: AuthRequest, res: Response) => {
    try {
        const { bookId } = req.params;
        const book = await bookService.getBooks().then(books => books.find(b => b.bookId === bookId));
        if (!book) throw new Error('Book not found');
        res.render('pages/edit-book', { title: 'Sửa Sách', user: req.user, book, error: null });
    } catch (error: any) {
        res.redirect('/books');
    }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
    try {
        const { bookId } = req.params;
        const data = req.body;
        await bookService.updateBook(bookId, data);
        res.redirect('/books');
    } catch (error: any) {
        res.render('pages/edit-book', { title: 'Sửa Sách', user: req.user, book: null, error: error.message });
    }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
    try {
        const { bookId } = req.params;
        await bookService.deleteBook(bookId);
        res.redirect('/books');
    } catch (error: any) {
        res.render('pages/books', { title: 'Sách', user: req.user, books: [], borrowStatus: [], error: error.message });
    }
};

export const searchBooks = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        const books = await bookService.searchBooks(q as string);
        let borrowStatus: { bookId: string; status: string; quantity: number }[] = [];
        if (res.locals.user && res.locals.user.roleId === 2) {
            const borrows = await borrowService.getBorrowRequests(res.locals.user.id, 2);
            borrowStatus = books.map(book => {
                const borrow = borrows.find(borrow =>
                    borrow.status === 'approved' &&
                    borrow.books.some(b => {
                        const bookId = b.bookId instanceof Types.ObjectId ? b.bookId.toString() : ('_id' in b.bookId ? b.bookId._id.toString() : b.bookId.toString());
                        return bookId === book._id.toString();
                    })
                );
                if (borrow) {
                    const borrowedBook = borrow.books.find(b => {
                        const bookId = b.bookId instanceof Types.ObjectId ? b.bookId.toString() : ('_id' in b.bookId ? b.bookId._id.toString() : b.bookId.toString());
                        return bookId === book._id.toString();
                    });
                    return {
                        bookId: book._id.toString(),
                        status: 'Đã mượn',
                        quantity: borrowedBook ? borrowedBook.quantity : 0
                    };
                }
                return { bookId: book._id.toString(), status: 'Chưa mượn', quantity: 0 };
            });
        }
        res.render('pages/books', {
            title: 'Sách',
            books,
            borrowStatus,
            error: books.length === 0 ? 'Không tìm thấy sách' : null
        });
    } catch (error: any) {
        res.render('pages/books', {
            title: 'Sách',
            books: [],
            borrowStatus: [],
            error: error.message
        });
    }
};