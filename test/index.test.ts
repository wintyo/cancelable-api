import http from 'http';
import CancelableAPI from '../lib/index';

const API = new CancelableAPI('http://localhost:4000');

describe('Request test', () => {
  let server: http.Server;
  beforeAll(() => {
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
