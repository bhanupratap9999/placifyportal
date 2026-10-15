const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();
const { connectDB, isUsingMockDB } = require('./config/db');
const { getUploadDirectory } = require('./config/uploads');
const seedUsers = require('./seedUsers');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const microtaskRoutes = require('./routes/microtaskRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const server = http.createServer(app);
const production = process.env.NODE_ENV === 'production';
if (production) {
    app.set('trust proxy', 1);
}
const localOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];
const frontendOrigin = process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : null;

if (production) {
    const missing = ['JWT_SECRET', 'MONGODB_URI', 'FRONTEND_URL', 'UPLOADS_DIR']
        .filter((name) => !process.env[name]);
    if (missing.length) {
        throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    }
    if (new URL(process.env.FRONTEND_URL).protocol !== 'https:') {
        throw new Error('FRONTEND_URL must use HTTPS in production');
    }
}

const allowedOrigins = production
    ? [frontendOrigin]
    : [...new Set([...localOrigins, ...(frontendOrigin ? [frontendOrigin] : [])])];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts. Try again later.' }
});
app.use('/api/auth', authLimiter);

// Serve only profile images; resumes and course videos use protected routes.
app.use('/uploads/profile-pictures', express.static(getUploadDirectory('profile-pictures'), {
    dotfiles: 'deny',
    index: false,
    maxAge: '1d'
}));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Project25 API' });
});
app.get('/health', (req, res) => {
    const databaseReady = mongoose.connection.readyState === 1 || isUsingMockDB();
    res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? 'ok' : 'unavailable' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Internship routes
app.use('/api/internships', internshipRoutes);

// Microtask routes (mounted under internships)
app.use('/api/internships/:id/microtasks', microtaskRoutes);

// Newsletter routes
app.use('/api/newsletters', newsletterRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Course routes
app.use('/api/courses', courseRoutes);

// Payment routes (Razorpay)
app.use('/api/payment', paymentRoutes);

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        ...(production ? {} : { error: err.message })
    });
});

// Socket.io connection handling
const connectedUsers = new Map(); // Map userId to socketId

io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // User registers their ID
    socket.on('register', (userId) => {
        connectedUsers.set(userId, socket.id);
        console.log(`👤 User ${userId} registered with socket ${socket.id}`);
        console.log('📊 Connected users:', Array.from(connectedUsers.keys()));
    });

    socket.on('disconnect', () => {
        // Remove user from connected users
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                console.log(`👋 User ${userId} disconnected`);
                console.log('📊 Connected users:', Array.from(connectedUsers.keys()));
                break;
            }
        }
    });
});

// Export connectedUsers for use in controllers
app.set('connectedUsers', connectedUsers);

const startServer = async () => {
    await connectDB();
    if (!production && isUsingMockDB()) {
        await seedUsers();
    }

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
});
