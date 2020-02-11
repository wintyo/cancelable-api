import http from 'http';
import CancelableAPI from '../lib/index';

describe('Request test', () => {
  let API: CancelableAPI;
  let server: http.Server;
  beforeAll(() => {
    API = new CancelableAPI('http://localhost:4000');
    return new Promise((resolve) => {
      server = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.end('ok');
      });
      server.listen(4000, resolve);
    });
  });

  afterAll(() => {
    API.dispose();
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('normal', (done) => {
    API.request({
      url: '',
    })
      .then((res) => {
        console.log('response:');
        console.log(res.data);
      })
      .finally(() => {
        console.log('done');
        done();
      });
  });
});
