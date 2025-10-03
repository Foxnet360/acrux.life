/**
 * Centralized configuration management for the application
 */

interface DatabaseConfig {
  url: string
  maxConnections: number
  connectionTimeout: number
}

interface AuthConfig {
  secret: string
  url: string
  maxAge: number
  providers: {
    credentials: boolean
  }
}

interface AWSConfig {
  region: string
  bucketName: string
  accessKeyId: string
  secretAccessKey: string
  folderPrefix: string
  maxFileSize: number
  allowedTypes: string[]
}

interface AppConfig {
  name: string
  version: string
  environment: 'development' | 'staging' | 'production'
  url: string
  port: number
  debug: boolean
}

interface PaginationConfig {
  defaultPageSize: number
  maxPageSize: number
}

interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error'
  enableConsole: boolean
  enableFile: boolean
}

class Config {
  private _database: DatabaseConfig
  private _auth: AuthConfig
  private _aws: AWSConfig
  private _app: AppConfig
  private _pagination: PaginationConfig
  private _logging: LoggingConfig

  constructor() {
    this._database = {
      url: process.env.DATABASE_URL || '',
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000')
    }

    this._auth = {
      secret: process.env.NEXTAUTH_SECRET || '',
      url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      providers: {
        credentials: true
      }
    }

    this._aws = {
      region: process.env.AWS_REGION || 'us-east-1',
      bucketName: process.env.AWS_BUCKET_NAME || '',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      folderPrefix: process.env.AWS_FOLDER_PREFIX || 'dev/',
      maxFileSize: 500 * 1024 * 1024, // 500MB
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/csv',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    }

    this._app = {
      name: 'Acrux',
      version: process.env.npm_package_version || '1.0.0',
      environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      port: parseInt(process.env.PORT || '3000'),
      debug: process.env.NODE_ENV === 'development'
    }

    this._pagination = {
      defaultPageSize: 20,
      maxPageSize: 100
    }

    this._logging = {
      level: (process.env.LOG_LEVEL as LoggingConfig['level']) || 'info',
      enableConsole: process.env.NODE_ENV !== 'production',
      enableFile: process.env.NODE_ENV === 'production'
    }
  }

  get database(): DatabaseConfig {
    return this._database
  }

  get auth(): AuthConfig {
    return this._auth
  }

  get aws(): AWSConfig {
    return this._aws
  }

  get app(): AppConfig {
    return this._app
  }

  get pagination(): PaginationConfig {
    return this._pagination
  }

  get logging(): LoggingConfig {
    return this._logging
  }

  /**
   * Validate required environment variables
   */
  validate(): void {
    const required = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'AWS_BUCKET_NAME',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY'
    ]

    const missing = required.filter(key => !process.env[key])

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this._app.environment === 'production'
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this._app.environment === 'development'
  }

  /**
   * Get full AWS S3 key with prefix
   */
  getS3Key(fileName: string): string {
    return `${this._aws.folderPrefix}uploads/${Date.now()}-${fileName}`
  }

  /**
   * Check if file type is allowed
   */
  isFileTypeAllowed(mimeType: string): boolean {
    return this._aws.allowedTypes.includes(mimeType)
  }

  /**
   * Get pagination settings
   */
  getPaginationSettings(requestedPageSize?: number) {
    const pageSize = Math.min(
      requestedPageSize || this._pagination.defaultPageSize,
      this._pagination.maxPageSize
    )

    return {
      defaultPageSize: this._pagination.defaultPageSize,
      maxPageSize: this._pagination.maxPageSize,
      pageSize
    }
  }
}

// Export singleton instance
export const config = new Config()

// Validate configuration on import
if (typeof window === 'undefined') {
  config.validate()
}