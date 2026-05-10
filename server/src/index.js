require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const { createServer } = require('http');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scans');
const chatRoutes = require('./routes/chat');
const issueRoutes = require('./routes/issues');
const repoRoutes = require('./routes/repos');
const domainRoutes = require('./routes/domains');
const billingRoutes = require('./routes/billing');
const reportRoutes = require('./routes/reports');
const codeReviewRoutes = require('./routes/codeReview');
const scheduledRoutes = require('./routes/scheduled');
const attackSurfaceRoutes = require('./routes/attackSurface');
const errorHandler = require('./middleware/error');

const app = express();
const httpServer = createServer(app);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentinel';

const allowedOrigins = [
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

// ── Middleware ──
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies to be sent cross-origin
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Trust Proxy (Must be before session middleware) ──
app.set('trust proxy', 1);

// ── Session (HttpOnly cookie → MongoDB store) ──
app.use(session({
  name: 'sentinel.sid',
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'sentinel-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60, // 7 days
  }),
  cookie: {
    httpOnly: true,                                          // JS cannot read the cookie
    secure: process.env.NODE_ENV === 'production',           // HTTPS only in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    partitioned: process.env.NODE_ENV === 'production',      // Enable CHIPS for 3rd party cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,                        // 7 days
    // In dev: share cookie across localhost ports (5000 server / 5173 client)
    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
  },
}));

app.use(passport.initialize());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/code-review', codeReviewRoutes);
app.use('/api/scheduled-pentests', scheduledRoutes);
app.use('/api/attack-surface', attackSurfaceRoutes);

// ── Error handler (must be last) ──
app.use(errorHandler);

// ── Database + Server start ──
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected');

    httpServer.listen(PORT, () => {
      console.log(`✓ Sentinel API running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Sessions: MongoDB-backed, HttpOnly cookies`);
    });

    // Simple polling for scheduled scans (checks every 5 minutes)
    setInterval(async () => {
      try {
        const Scan = require('./models/Scan');
        const ScanOrchestrator = require('./engine/orchestrator');
        // Find scans that have scheduling enabled and whose next run time has passed
        const scheduled = await Scan.find({
          'schedule.enabled': true,
          'schedule.nextRun': { $lte: new Date() },
          status: { $in: ['completed', 'failed'] }
        });
        for (const template of scheduled) {
          const newScan = await Scan.create({
            userId: template.userId,
            name: `${template.name} (Auto)`,
            targets: template.targets,
            scanType: template.scanType,
            access: template.access,
            context: template.context,
          });
          const orchestrator = new ScanOrchestrator(newScan, template.userId);
          orchestrator.run().catch(() => {});

          // Schedule next run (+1 day rough)
          const next = new Date();
          next.setDate(next.getDate() + 1);
          template.schedule.nextRun = next;
          await template.save();
        }
      } catch (e) {
        // silently ignore scheduler errors
      }
    }, 5 * 60 * 1000);
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

// ── Graceful shutdown ──
process.on('SIGTERM', async () => {
  console.log('SIGTERM received — shutting down');
  await mongoose.connection.close();
  httpServer.close(() => process.exit(0));
});

start();
