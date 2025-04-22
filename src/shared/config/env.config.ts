import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/Owasp',
    PORT: process.env.PORT || 3039,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
}