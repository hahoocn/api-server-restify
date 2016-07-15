import 'babel-polyfill';
import fs from 'fs';
import restify from 'restify';
import bunyan from 'bunyan';
import config from './config';
import routes from './routes';

function checkLogDirectory() {
  return new Promise((resolve, reject) => {
    fs.stat(config.logPath, (err, stats) => {
      if (err || !stats.isDirectory()) {
        fs.mkdir(config.logPath, (error) => {
          if (error) {
            reject(new Error(error));
          }
        });
      }

      resolve();
    });
  });
}

function createLogger() {
  const log = bunyan.createLogger({
    name: config.name,
    streams: [{
      level: 'warn',
      path: `logs/${config.name}_warn.log`
    }, {
      level: 'error',
      path: `logs/${config.name}_error.log`
    }, {
      level: 'fatal',
      path: `logs/${config.name}_fatal.log`
    }, {
      level: 'info',
      path: `logs/${config.name}_info.log`
    }]
  });
  return Promise.resolve(log);
}

function createServer(log) {
  const server = restify.createServer({
    log,
    name: config.name
  });

  server.use(restify.queryParser());
  server.use(restify.bodyParser({
    mapParams: false
  }));
  /* eslint new-cap: 0 */
  server.use(restify.CORS());

  routes(server);

  server.listen(config.port, () => {
    log.info(`${server.name} start listening at ${server.url}`);
    console.info('==> 🚀 %s listening at %s', server.name, server.url);
  });
}

async function startServer() {
  await checkLogDirectory();
  const log = await createLogger();
  createServer(log);
}

startServer();
