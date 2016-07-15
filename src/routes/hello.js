import hello from '../api/hello';

export default function helloRoute(server) {
  server.get('/hello', hello);
}
