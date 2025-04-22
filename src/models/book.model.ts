import { Schema, model, Document } from 'mongoose';

export interface IBook extends Document {
    bookId: string;
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    quantity: number;
    isAvailable: boolean;
}

const bookSchema = new Schema<IBook>(
    {
        bookId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        description: { type: String },
        coverUrl: { type: String },
        quantity: { type: Number, required: true, default: 0 },
        isAvailable: { type: Boolean, default: function () { return this.quantity > 0; } },
    },
    { timestamps: true }
);

bookSchema.pre('save', function (next) {
    this.isAvailable = this.quantity > 0;
    next();
});

const Book = model<IBook>('Book', bookSchema);
export default Book;