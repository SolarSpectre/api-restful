import express from 'express';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv'
import userRoutes from './routers/user_routes.js';
import communityRoutes from './routers/communities_routes.js';

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
}));

// Settings
app.set('port', process.env.PORT || 4000);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);

export default app;
