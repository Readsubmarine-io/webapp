import { AxiosRequestConfig } from 'axios'

export type QueryParams<T> = {
  params: T
  requestConfig?: AxiosRequestConfig
}
