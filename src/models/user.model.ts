import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string; // A02: Cryptographic Failures - Plaintext password
    roleId: number; // A08: Software and Data Integrity Failures - Dễ ghi đè
    bio: string; // A03: Injection - Không sanitize
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleId: { type: Number, default: 2 }, // 1: Admin, 2: Student, 3: Librarian
    bio: { type: String },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;