import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';

export const registerUser = async (username: string, email: string, password: string) => {
    // A02: Cryptographic Failures - Lưu plaintext password
    const user = new User({ username, email, password, roleId: 2, bio: '' });
    await user.save();
    return user;
};

export const loginUser = async (email: string, password: string) => {
    // A03: Injection - Dễ bị NoSQL injection
    const user = await User.findOne({ email, password });
    if (!user) throw new Error('Invalid credentials');

    // A07: Identification and Authentication Failures - Secret yếu
    const accessToken = jwt.sign(
        { id: user._id, roleId: user.roleId },
        'weak-secret',
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id, roleId: user.roleId },
        'weak-refresh-secret',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken, user };
};

export const getUserById = async (userId: string) => {
    return await User.findById(userId);
};

export const updateProfile = async (userId: string, data: Partial<IUser>, callerRoleId: number) => {
    // A01: Broken Access Control - Chỉ Admin được thay đổi roleId
    if (callerRoleId !== 1) {
        delete data.roleId; // Loại bỏ roleId nếu không phải Admin
    }
    await User.updateOne({ _id: userId }, { $set: data });
    return await User.findById(userId);
};

export const getAllUsers = async () => {
    // A01: Broken Access Control - Không kiểm tra quyền
    return await User.find();
};

export const updateUser = async (userId: string, data: Partial<IUser>) => {
    // A01: Broken Access Control - Cho phép sửa mọi trường
    await User.updateOne({ _id: userId }, data);
    return await User.findById(userId);
};

export const deleteUser = async (userId: string) => {
    await User.deleteOne({ _id: userId });
};