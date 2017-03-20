import 'babel-polyfill';
import restify from 'restify';
import bunyan from 'bunyan';
import fs from 'fs-extra';
import config from './config';
import routes from './routes';

const logPath = 'logs/app';

function checkLogDirectory() {
  return new Promise((resolve, reject) => {
    fs.ensureDir(logPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}

function createLogger() {
  const log = bunyan.createLogger({
    name: config.name,
    streams: [{
      level: 'warn',
      path: `${logPath}/warn.log`
    }, {
      level: 'error',
      path: `${logPath}/error.log`
    }, {
      level: 'fatal',
      path: `${logPath}/fatal.log`
    }, {
      level: 'info',
      path: `${logPath}/info.log`
    }]
  });
  return Promise.resolve(log);
}

function createServer(log) {
  const server = restify.createServer({
    log,
    name: config.name,
    version: '1.0.0'
  });
  server.use(restify.throttle({
    burst: 20,
    rate: 10,
    ip: true,
  }));
  server.use(restify.queryParser());
  server.use(restify.bodyParser({
    mapParams: false,
    mapFiles: false,
    keepExtensions: true,
    multiples: true
  }));
  server.use(restify.CORS());
  server.use((req, res, next) => {
    res.charSet('utf-8');
    next();
  });

  routes(server);

  server.on('NotFound', (req, res) => {
    res.json(404, { errcode: 404, errmsg: 'Not Found' });
  });

  server.on('MethodNotAllowed', (req, res) => {
    res.json(405, { errcode: 405, errmsg: 'Method Not Allowed' });
  });

  server.on('InvalidContent', (req, res) => {
    res.json(400, { errcode: 400, errmsg: 'Invalid Content' });
  });

  server.listen(config.port, () => {
    log.info(`${server.name} start listening at ${server.url}`);
    console.info('==> 🚀 %s listening at %s', server.name, server.url);
  });
}

async function startServer() {
  try {
    const isLogDirectoryExist = await checkLogDirectory();
    if (isLogDirectoryExist) {
      const log = await createLogger();
      createServer(log);
    }
  } catch (e) {
    console.error(e);
  }
}

startServer();
