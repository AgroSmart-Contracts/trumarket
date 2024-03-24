export const config = {
  databaseUrl: process.env.DATABASE_URL || 'mongodb://mongo',
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'debug',
  logsDestination: process.env.LOGS_DESTINATION || '/app/logs/out.log',
  version: process.env.COMMIT_HASH || 'v0.0.0',
  s3Bucket: process.env.S3_BUCKET || 'api-bucket',
  awsEndpoint: process.env.AWS_ENDPOINT,
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  jwtSecret: process.env.JWT_SECRET || 'yourjsonwebtokensecret',
};
