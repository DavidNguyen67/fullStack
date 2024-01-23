import { registerAs } from '@nestjs/config';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3307;

export default registerAs('database', () => ({
  host,
  port,
}));
