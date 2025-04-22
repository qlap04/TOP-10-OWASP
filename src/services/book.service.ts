import Book, { IBook } from '../models/book.model';
import fetch from 'node-fetch';

export const addBook = async (bookId: string, title: string, author: string, description: string, coverUrl: string, quantity: number) => {
    // A03: Injection - Không sanitize description
    const book = new Book({ bookId, title, author, description, coverUrl, quantity });
    await book.save();
    return book;
};

export const updateBook = async (bookId: string, data: Partial<IBook>) => {
    // A03: Injection - Không sanitize description
    await Book.updateOne({ bookId }, data);
    return await Book.findOne({ bookId });
};

export const deleteBook = async (bookId: string) => {
    await Book.deleteOne({ bookId });
};

export const getBooks = async () => {
    return await Book.find();
};

export const searchBooks = async (query: string) => {
    // A03: Injection - Không sanitize query
    return await Book.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
        ],
    });
};

export const fetchBookCover = async (url: string) => {
    // A10: Server-Side Request Forgery - Không kiểm tra URL
    const response = await fetch(url);
    return await response.text();
};