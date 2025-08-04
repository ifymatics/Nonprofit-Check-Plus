import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  jwtSecret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 5433),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  kafka: {
    broker: process.env.KAFKA_BROKER,
  },
}));
