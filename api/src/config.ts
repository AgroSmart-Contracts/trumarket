export const config = {
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'debug',
  logsDestination: process.env.LOGS_DESTINATION || '/app/logs/out.log',
  version: process.env.COMMIT_HASH || "v0.0.0"
}
