import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import PCancelable from 'p-cancelable';

export interface IRequestCallbacks {
  onRequestStart?: () => void;
  onSuccess?: () => void;
  onFailure?: () => void;
  onCancel?: () => void;
  onRequestEnd?: () => void;
}

export function request<T = any>(requestConfig: AxiosRequestConfig, callbacks: IRequestCallbacks = {}): PCancelable<AxiosResponse<T>> {
  const source = axios.CancelToken.source();

  return new PCancelable<AxiosResponse<T>>(async (resolve, reject, onCancel) => {
    // request start
    callbacks.onRequestStart && callbacks.onRequestStart();

    try {
      const response = await axios.request<T>(requestConfig);
      callbacks.onSuccess && callbacks.onSuccess();
      resolve(response);
    } catch(error) {
      // no operation if the request has already canceled.
      if (axios.isCancel(error)) {
        return;
      }
      callbacks.onFailure && callbacks.onFailure();
      reject({
        isCancel: false,
        error,
      });
    } finally {
      callbacks.onRequestEnd && callbacks.onRequestEnd();
    }

    // if cancellation of request triggered
    onCancel(() => {
      callbacks.onCancel && callbacks.onCancel();
      source.cancel();
      reject({
        isCancel: true,
      });
    });
  });
}
