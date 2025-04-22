import Borrow, { IBorrow } from '../models/borrow.model';
import Book from '../models/book.model';

export const createBorrowRequest = async (userId: string, books: { bookId: string; quantity: number }[]) => {
    // A04: Insecure Design - Không giới hạn số lượng sách
    for (const item of books) {
        const book = await Book.findById(item.bookId);
        if (!book) throw new Error(`Sách với ID ${item.bookId} không tồn tại`);
        if (book.quantity < item.quantity) {
            throw new Error(`Số lượng sách "${book.title}" không đủ`);
        }
    }

    const borrow = new Borrow({ userId, books, status: 'pending' });
    await borrow.save();
    return await borrow.populate([
        { path: 'userId', select: 'username email' },
        { path: 'books.bookId', select: 'title author' },
    ]);
};

export const getBorrowRequests = async (userId: string, roleId: number) => {
    // A01: Broken Access Control - Dễ bypass kiểm tra
    if (roleId === 2) {
        return await Borrow.find({ userId })
            .populate('userId', 'username email')
            .populate('books.bookId', 'title author');
    }
    return await Borrow.find()
        .populate('userId', 'username email')
        .populate('books.bookId', 'title author');
};

export const getApprovedBorrows = async (userId: string) => {
    return await Borrow.find({ userId, status: 'approved' })
        .populate('userId', 'username email')
        .populate('books.bookId', 'title author');
};

export const getRejectedBorrows = async (userId: string) => {
    return await Borrow.find({ userId, status: 'rejected' })
        .populate('userId', 'username email')
        .populate('books.bookId', 'title author');
};

export const updateBorrowStatus = async (borrowId: string, status: 'approved' | 'rejected') => {
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) throw new Error('Yêu cầu mượn không tồn tại');

    // Chỉ giảm số lượng sách khi phê duyệt
    if (status === 'approved' && borrow.status === 'pending') {
        for (const bookRequest of borrow.books) {
            const book = await Book.findById(bookRequest.bookId);
            if (!book) throw new Error(`Sách với ID ${bookRequest.bookId} không tồn tại`);
            if (book.quantity < bookRequest.quantity) {
                throw new Error(`Số lượng sách "${book.title}" không đủ`);
            }
            book.quantity -= bookRequest.quantity;
            await book.save();
        }
    }

    borrow.status = status;
    await borrow.save();
    return await borrow.populate([
        { path: 'userId', select: 'username email' },
        { path: 'books.bookId', select: 'title author' },
    ]);
};

export const deleteBorrowRequest = async (borrowId: string) => {
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) throw new Error('Yêu cầu mượn không tồn tại');
    if (borrow.status !== 'approved') throw new Error('Chỉ được xóa yêu cầu mượn đã phê duyệt');

    // Cộng lại số lượng sách khi xóa yêu cầu mượn
    for (const bookRequest of borrow.books) {
        const book = await Book.findById(bookRequest.bookId);
        if (!book) throw new Error(`Sách với ID ${bookRequest.bookId} không tồn tại`);
        book.quantity += bookRequest.quantity;
        await book.save();
    }

    // Xóa yêu cầu mượn
    await Borrow.deleteOne({ _id: borrowId });
};