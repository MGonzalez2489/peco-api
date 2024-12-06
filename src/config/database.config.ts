export const databaseConfig = () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5000,
    username: process.env.DB_USER || 'unknown',
    password: process.env.DB_PASSWORD || 'unknown',
    database: process.env.DB_NAME || 'unknown',
    synchronize: false, //process.env.DB_SYNC === 'true' || false,
  },
});
