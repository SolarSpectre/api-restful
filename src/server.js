import express from 'express';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import userRoutes from './routes/user_routes.js';
import communityRoutes from './routes/community_routes.js';

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
