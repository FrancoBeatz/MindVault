/**
 * Centralized error handling for API routes
 */

interface ApiError {
  statusCode: number;
  message: string;
  code?: string;
}

class ErrorHandler {
  /**
   * PostgreSQL error code to HTTP status mapping
   */
  private static readonly PG_ERROR_MAP: Record<string, number> = {
    '23505': 409, // Unique violation
    '23503': 409, // Foreign key violation
    '23502': 400, // NOT NULL violation
    '23514': 400, // CHECK violation
    '42P01': 404, // Table not found
    '42703': 400, // Column not found
    '57P03': 503, // Database is in recovery mode
  };

  /**
   * Handle errors from route handlers
   */
  static handleRouteError(error: unknown, context: string): ApiError {
    console.error(`[${context}] Error:`, error);

    // PostgreSQL errors
    if (this.isPgError(error)) {
      return this.handlePgError(error, context);
    }

    // Authentication errors
    if (this.isAuthError(error)) {
      return {
        statusCode: 401,
        message: 'Authentication failed',
      };
    }

    // Generic error
    return {
      statusCode: 500,
      message: 'Internal server error',
    };
  }

  /**
   * Handle PostgreSQL-specific errors
   */
  private static handlePgError(error: any, context: string): ApiError {
    const code = error.code || error.sqlState;
    const statusCode = this.PG_ERROR_MAP[code] || 500;

    let message = 'Database error';

    // Map specific error codes to user-friendly messages
    if (code === '23505') {
      message = 'This record already exists';
    } else if (code === '23503') {
      message = 'Invalid reference to another record';
    } else if (code === '23502') {
      message = 'Missing required field';
    } else if (code === '42P01') {
      message = 'Database resource not found';
    } else if (statusCode === 500) {
      message = 'Database connection error';
    }

    console.error(`[${context}] PostgreSQL Error ${code}:`, error.message);

    return {
      statusCode,
      message,
      code,
    };
  }

  /**
   * Check if error is a PostgreSQL error
   */
  private static isPgError(error: any): boolean {
    return error && (error.code || error.sqlState || error.severity);
  }

  /**
   * Check if error is an authentication error
   */
  private static isAuthError(error: any): boolean {
    return (
      error &&
      (error.name === 'UnauthorizedError' ||
        error.message?.toLowerCase().includes('unauthorized') ||
        error.message?.toLowerCase().includes('invalid token'))
    );
  }

  /**
   * Log error for monitoring/debugging
   */
  static logError(error: unknown, context: string, userId?: string): void {
    const timestamp = new Date().toISOString();
    const userInfo = userId ? ` [User: ${userId}]` : '';

    console.error(
      `[${timestamp}] [${context}]${userInfo} Error:`,
      error instanceof Error ? error.message : error
    );

    // In production, send to error tracking service (Sentry, DataDog, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error tracking
      // captureException(error, { tags: { context, userId } });
    }
  }
}

export default ErrorHandler;