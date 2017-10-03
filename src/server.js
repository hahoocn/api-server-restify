import restify from 'restify';
import bunyan from 'bunyan';
import fs from 'fs-extra';
import corsMiddleware from 'restify-cors-middleware';
import config from './config';
import routes from './routes';

const logPath = 'logs/app';

const createLogger = () => {
  const log = bunyan.createLogger({
    name: config.name,
    streams: [
      {
        level: 'warn',
        path: `${logPath}/warn.log`
      },
      {
        level: 'error',
        path: `${logPath}/error.log`
      },
      {
        level: 'fatal',
        path: `${logPath}/fatal.log`
      },
      {
        level: 'info',
        path: `${logPath}/info.log`
      }
    ]
  });
  return Promise.resolve(log);
};

const createServer = (log) => {
  const server = restify.createServer({
    log,
    name: config.name,
    version: '1.0.0',
    strictRouting: true
  });
  server.use(restify.plugins.throttle({
    burst: 20,
    rate: 10,
    ip: true,
  }));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser({
    mapParams: false,
    mapFiles: false,
    keepExtensions: true,
    multiples: true
  }));
  server.use((req, res, next) => {
    res.charSet('utf-8');
    next();
  });

  const cors = corsMiddleware({ origins: ['*'] });
  server.pre(cors.preflight);
  server.use(cors.actual);

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
};

const startServer = async () => {
  try {
    await fs.ensureDir(logPath);
    const log = await createLogger();
    createServer(log);
  } catch (e) {
    console.error(e);
  }
};

startServer();
