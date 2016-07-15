import path from 'path';

const config = {
  name: 'MyApp',
  port: process.env.PORT || 3030,
  logPath: path.resolve(__dirname, '../logs')
};

export default config;
