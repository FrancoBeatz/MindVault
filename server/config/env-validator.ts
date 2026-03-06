/**
 * Environment variable validation and schema
 */

interface DatabaseConfig {
  url: string;
  isSupabase: boolean;
  timeout: number;
}

class EnvValidator {
  /**
   * Validate that a required environment variable exists
   */
  private static validateRequired(name: string, value?: string): string {
    if (!value || value.trim() === '') {
      throw new Error(`CRITICAL: Missing required environment variable: ${name}`);
    }
    return value;
  }

  /**
   * Validate and parse the database configuration
   */
  static getDatabaseConfig(): DatabaseConfig {
    const databaseUrl = this.validateRequired(
      'DATABASE_URL',
      process.env.DATABASE_URL
    );

    const isSupabase = databaseUrl.includes('supabase.co');

    return {
      url: databaseUrl,
      isSupabase,
      timeout: parseInt(process.env.DB_TIMEOUT || '10', 10),
    };
  }

  /**
   * Validate all required environment variables on startup
   */
  static validateAll(): void {
    const required = ['DATABASE_URL'];
    const missing: string[] = [];

    for (const envVar of required) {
      if (!process.env[envVar]) {
        missing.push(envVar);
      }
    }

    if (missing.length > 0) {
      const message = `Missing required environment variables: ${missing.join(', ')}`;
      console.error(`❌ ${message}`);
      throw new Error(message);
    }

    console.log('✅ All environment variables validated');
  }
}

export default EnvValidator;