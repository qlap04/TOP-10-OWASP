import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
    roleName: string;
    roleId: number; // 1: admin, 2: student, 3: librarian
}

const roleSchema = new Schema<IRole>({
    roleName: { type: String, required: true },
    roleId: { type: Number, required: true },
});

const Role = mongoose.model<IRole>('Role', roleSchema);
export default Role;