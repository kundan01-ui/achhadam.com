const logger = require('../utils/logger').default;

// Custom error class
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    [key: string]: any;
  };
}

// Error handler middleware
const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }
  // Handle Prisma errors
  else if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation failed';
    isOperational = true;
  }
  // Handle Prisma validation errors
  else if (error.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
    isOperational = true;
  }
  // Handle Prisma unique constraint errors
  else if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
    isOperational = true;
  }
  // Handle Prisma foreign key errors
  else if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2003') {
    statusCode = 400;
    message = 'Referenced resource not found';
    isOperational = true;
  }
  // Handle Prisma not found errors
  else if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
    isOperational = true;
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    isOperational = true;
  }
  // Handle Mongoose cast errors
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    isOperational = true;
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Resource already exists';
    isOperational = true;
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }
  // Handle JWT expiration errors
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    isOperational = true;
  }
  // Handle Multer errors
  else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
    isOperational = true;
  }
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    isOperational = true;
  }

  // Log error
  if (isOperational) {
    logger.warn(`Operational error: ${message}`, {
      statusCode,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      error: error.message,
    });
  } else {
    logger.error(`System error: ${error.message}`, {
      statusCode,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      stack: error.stack,
    });
  }

  // Create error response
  const errorResponse: ErrorResponse = {
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  };

  // Add validation errors if available
  if (error.name === 'ValidationError' && (error as any).details) {
    errorResponse.error.details = (error as any).details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError
};

