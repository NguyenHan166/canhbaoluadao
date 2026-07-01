import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './modules/auth/auth.routes.js';
import categoriesRouter from './modules/categories/categories.routes.js';
import sourcesRouter from './modules/sources/sources.routes.js';
import articlesRouter from './modules/articles/articles.routes.js';
import mediaRouter from './modules/media/media.routes.js';
import reportsRouter from './modules/reports/reports.routes.js';
import settingsRouter from './modules/settings/settings.routes.js';
import analyticsRouter from './modules/analytics/analytics.routes.js';
import auditLogsRouter from './modules/audit/audit.routes.js';
import handbooksRouter from './modules/handbooks/handbooks.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api', categoriesRouter);
app.use('/api', sourcesRouter);
app.use('/api', articlesRouter);
app.use('/api', reportsRouter);
app.use('/api', settingsRouter);
app.use('/api', handbooksRouter);
app.use('/api/admin', mediaRouter);
app.use('/api/admin', analyticsRouter);
app.use('/api/admin', auditLogsRouter);






// Health check endpoint
app.get('/', (req: Request, res: Response) => {

  res.status(200).json({
    success: true,
    message: 'Lá Chắn Số API - System operational',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    errors: err.errors || []
  });
});

export default app;
