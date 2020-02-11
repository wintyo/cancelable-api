import { AxiosRequestConfig, AxiosResponse } from 'axios';
import PCancelable from 'p-cancelable';
import { request, IRequestCallbacks } from './request';

const APIs: Array<CancelableAPI> = [];

class CancelableAPI {
  private apiRoot = '';
  private pCancelableList: Array<PCancelable<any>> = [];

  constructor(apiRoot = '') {
    this.apiRoot = apiRoot;
    APIs.push(this);
  }

  setAPIRoot(apiRoot: string) {
    this.apiRoot = apiRoot;
  }

  request<T = any>(requestConfig: AxiosRequestConfig, callbacks: IRequestCallbacks = {}): PCancelable<AxiosResponse<T>> {
    const pCancelable = request<T>({
      baseURL: this.apiRoot,
      ...requestConfig,
    }, callbacks);
    this.pCancelableList.push(pCancelable);

    pCancelable
      .catch(() => {})
      // extract the request promise if the request finished.
      .finally(() => {
        this.pCancelableList = this.pCancelableList.filter((promise) => promise !== pCancelable);
      });

    return pCancelable;
  }

  cancelAll() {
    this.pCancelableList.forEach((pCancelable) => {
      pCancelable.cancel();
    });

    this.pCancelableList = [];
  }

  static cancelAll() {
    APIs.forEach((API) => {
      API.cancelAll();
    });
  }
}

export default CancelableAPI;
