export const jwtConfig = () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'qwerty',
    expiresIn: process.env.JWT_EXPIRATION || '60s',
  },
});
