import hello from '../api/hello';

const helloRoute = (server) => {
  server.get('/hello', hello);
};

export default helloRoute;
