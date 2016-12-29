import configJson from '../config/app/config.json';

const config = configJson;
config.port = process.env.PORT || config.port || 8080;

export default config;
