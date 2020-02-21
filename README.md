# Cancelable API
Cancelable HTTP request based on axios using p-cancelable.

## Installation
### yarn
```
$ yarn add @wintyo/cancelable-api
```

### npm
```
$ npm install --save @wintyo/cancelable-api
```

## Usage
```
import CancelableAPI from '@wintyo/cancelable-api';

const API = new CancelableAPI('http://localhost:3000/');

(async () => {
  // the request config and the response data are equivalent to axios.
  const response = await API.request({ url: '/api' });
  console.log(response);
})();

(() => {
  const pCancelable = API.request({ url: '/wait' });

  window.setTimeout(() => {
    // you can cancel while requesting.
    pCancelable.cancel();
  }, 1000);
})();

(() => {
  API.request({ url: '/wait1' });
  API.request({ url: '/wait2' });
  API.request({ url: '/wait3' });

  window.setTimeout(() => {
    // cancel all requests called the instance.
    API.cancelAll();
  }, 1000);
})();
```

## API
### Class method(instance)
#### constructor(apiRoot = '')
apiRoot is used by baseURL of axios config.

#### CancelableAPI.request(config, callbacks = {})
HTTP request using axios.  
see [axios request config](https://github.com/axios/axios#request-config).  

You can also handling the request using callbacks.
```
{
  // call if request start
  onRequestStart: () => {},
  // call if request success (equivalent to promise.then)
  onSuccess: (response) => {},
  // call if request failure (like to promise.catch)
  onFailure: (error) => {},
  // call if request cancel (like to promise.catch)
  onCancel: () => {},
  // call if request end (after call onSuccess, onFailure, or onCancel)
  onRequestEnd: () => {},
}
```

The method return PCancelable, and you can cancel the request the PCancelable.

#### CancelableAPI.cancelAll()
Cancel all requests called the instance.

#### CancelableAPI.dispose()
If you do not need the instance, you can use dispose (like destructor).

### Static method
#### CancelableAPI.cancelAll()
Cancel all requests called instances based on CancelableAPI.

## Dependencies
+ axios
+ p-cancelable

## License
MIT
