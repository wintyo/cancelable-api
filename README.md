# Cancelabel API

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

const API = new CancelableAPI();

(async () => {
  const response = await API.request({ url: '/api' });
})();

(() => {
  const pCancelable = API.request({ url: '/wait' });

  window.setTimeout(() => {
    // you can cancel while requesting.
    pCancelable.cancel();
  }, 1000);
})();
```

## Dependencies
+ axios
+ p-cancelable

## License
MIT
