export default () => ({
  assets: {
    rootPath: '/../../',
    assetsPath: 'assets/',
    uploadsPath: 'uploads/',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'qwerty',
    expiresIn: '5h', //process.env.JWT_EXPIRATION || '60s',
    ignoreExpiration: false,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process?.env?.DB_PORT || '') || 5000,
    username: process.env.DB_USER || 'unknown',
    password: process.env.DB_PASSWORD || 'unknown',
    database: process.env.DB_NAME || 'unknown',
    synchronize: false, //process.env.DB_SYNC === 'true' || false,
    // entities: [`${__dirname}/../**/**.entity{.ts,.js}`], // this will automatically load all entity file in the src folder
    entities: [`${__dirname}/../../**/**.entity{.ts,.js}`], // this will automatically load all entity file in the src folder
  },
});
