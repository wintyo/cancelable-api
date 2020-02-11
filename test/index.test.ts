import http from 'http';
import { CancelError } from 'p-cancelable';
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

        if (req.url === '/wait') {
          setTimeout(() => {
            res.end('ok');
          }, 1000);
          return;
        }
        if (req.url === '/error') {
          res.statusCode = 400;
          res.end('error');
          return;
        }
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

  test('normal', async () => {
    const res = await API.request({
      url: '',
    });
    expect(res.data).toBe('ok');
  });

  test('callback', async () => {
    expect.assertions(4);

    const res = await API.request<string>({
      url: '',
    }, {
      onRequestStart: () => {
        expect(null).toBe(null);
      },
      onSuccess: (response) => {
        expect(response.data).toBe('ok');
      },
      onFailure: () => {
        expect('').toBe('fail');
      },
      onCancel: () => {
        expect('').toBe('fail');
      },
      onRequestEnd: () => {
        expect(null).toBe(null);
      },
    });
    expect(res.data).toBe('ok');
  });

  test('cancel', (done) => {
    const pCancelable = API.request({
      url: '/wait',
    });

    pCancelable
      .catch((error) => {
        expect(error).toBeInstanceOf(CancelError);
      })
      .finally(() => {
        done();
      });

    setTimeout(() => {
      pCancelable.cancel();
    }, 500);
  });

  test('global cancel', async () => {
    await Promise.all([
      (async() => {
        try {
          await API.request({
            url: '/wait',
          });
        } catch (error) {
          expect(error).toBeInstanceOf(CancelError);
        }
      })(),
      new Promise((resolve) => {
        setTimeout(() => {
          API.cancelAll();
          resolve();
        }, 500);
      }),
    ]);
  });

  test('error request', async () => {
    try {
      await API.request({
        url: '/error',
      });
    } catch (error) {
      expect(error.response.data).toBe('error');
    }
  });
});
