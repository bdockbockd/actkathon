export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET,
  },
  longdoMapKey: process.env.LONGDO_MAP_KEY,
});
