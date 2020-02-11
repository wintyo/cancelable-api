import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import PCancelable from 'p-cancelable';

export interface IRequestCallbacks<T> {
  onRequestStart?: () => void;
  onSuccess?: (response: AxiosResponse<T>) => void;
  onFailure?: (error: any) => void;
  onCancel?: () => void;
  onRequestEnd?: () => void;
}

export function request<T = any>(requestConfig: AxiosRequestConfig, callbacks: IRequestCallbacks<T> = {}): PCancelable<AxiosResponse<T>> {
  const source = axios.CancelToken.source();

  return new PCancelable<AxiosResponse<T>>((resolve, reject, onCancel) => {
    // request start
    callbacks.onRequestStart && callbacks.onRequestStart();

    axios.request<T>(requestConfig)
      .then((response) => {
        callbacks.onSuccess && callbacks.onSuccess(response);
        resolve(response);
      })
      .catch((error) => {
        // no operation if the request has already canceled.
        if (axios.isCancel(error)) {
          return;
        }
        callbacks.onFailure && callbacks.onFailure(error);
        reject(error);
      })
      .finally(() => {
        callbacks.onRequestEnd && callbacks.onRequestEnd();
      });

    // if cancellation of request triggered
    onCancel(() => {
      callbacks.onCancel && callbacks.onCancel();
      source.cancel();
    });
  });
}
