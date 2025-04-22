import { Schema, model, Document } from 'mongoose';

export interface IBorrow extends Document {
    userId: Schema.Types.ObjectId;
    books: { bookId: Schema.Types.ObjectId; quantity: number }[];
    status: 'pending' | 'approved' | 'rejected';
}

const borrowSchema = new Schema<IBorrow>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        books: [
            {
                bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    },
    { timestamps: true }
);

const Borrow = model<IBorrow>('Borrow', borrowSchema);
export default Borrow;