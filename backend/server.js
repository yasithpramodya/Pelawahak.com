const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();

// CORS configuration from env
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists for local storage fallback
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ Created uploads directory');
}

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/messages', messageRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed Admin User from ENV
    try {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const adminName = process.env.ADMIN_NAME || 'Admin';

      if (!adminEmail || !adminPassword) {
        console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed');
      } else {
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(adminPassword, salt);
          await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
          });
          console.log('✅ Admin account created successfully');
        } else if (adminExists.role !== 'admin') {
          adminExists.role = 'admin';
          await adminExists.save();
          console.log('✅ Admin role updated for existing account');
        }
      }
    } catch (error) {
      console.error('❌ Error seeding admin:', error);
    }

    const { createServer } = require('http');
    const { Server } = require('socket.io');
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
      }
    });

    // Socket.io connection logic
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    // Make io accessible in routes
    app.set('socketio', io);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  });