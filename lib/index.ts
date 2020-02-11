import { AxiosRequestConfig, AxiosResponse } from 'axios';
import PCancelable from 'p-cancelable';
import { request, IRequestCallbacks } from './request';

const APIs: Array<CancelableAPI> = [];

class CancelableAPI {
  private apiRoot = '';
  private pCancelableList: Array<PCancelable<any>> = [];
  private isDispose = false;

  constructor(apiRoot = '') {
    this.apiRoot = apiRoot;
    APIs.push(this);
  }

  setAPIRoot(apiRoot: string) {
    this.apiRoot = apiRoot;
  }

  /**
   * Request by axios
   * @param requestConfig - config for axios
   * @param callbacks - callbacks
   */
  request<T = any>(requestConfig: AxiosRequestConfig, callbacks: IRequestCallbacks<T> = {}): PCancelable<AxiosResponse<T>> {
    if (this.isDispose) {
      throw new Error('already diposed!');
    }

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

  /**
   * Cancel all requesting called the instance.
   */
  cancelAll() {
    this.pCancelableList.forEach((pCancelable) => {
      pCancelable.cancel();
    });

    this.pCancelableList = [];
  }

  /**
   * Dispose the instance
   */
  dispose() {
    if (this.isDispose) {
      console.warn('already diposed!');
      return;
    }
    this.cancelAll();
    console.log(APIs);
    const index = APIs.indexOf(this);
    if (index >= 0) {
      APIs.splice(index, 1);
    }
    console.log(APIs);
    this.isDispose = true;
  }

  /**
   * Cancel all requesting called the class.
   */
  static cancelAll() {
    APIs.forEach((API) => {
      API.cancelAll();
    });
  }
}

export default CancelableAPI;
