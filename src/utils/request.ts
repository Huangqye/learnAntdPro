/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 * 数组或对象 query params 处理，参考: https://github.com/umijs/umi-request/issues/165
 */
import { extend, RequestOptionsInit } from 'umi-request';
import { message, notification } from 'antd';
import { formatMessage, getLocale } from 'umi';
import { getToken } from '@/utils/authority';
import { isIE } from '@/utils/browserVersion';
import { BaseTableListResponse } from '@/services/sharedTypes/BaseTableListResponse';

/**
 * 错误信息
 */
export interface ErrorMessage {
  code: string;
  msg?: string;
  extra?: string[];
}

/**
 * 统一返回包装结构
 */
export interface ResultSet<D = any, T = ErrorMessage> {
  error: T;
  data: D;
}

export type AutoMsgType = ((statusCode: number) => boolean) | boolean;

/**
 * 自定义响应结构
 */
export interface CustomRequestOptionsInit extends RequestOptionsInit {
  // 是否自动报错
  autoMsg?: AutoMsgType;
  // 是否重定向
  noRedirect?: boolean;
  // 是否允许添加projectId Header
  projectHeader?: false | string;
  // 是否需要对数据进行fallback为[]的处理
  fallback?: boolean;
}

/**
 * 状态码信息
 */
const codeMessage = {
  200: 'request.200',
  201: 'request.201',
  202: 'request.202',
  204: 'request.204',
  400: 'request.400',
  401: 'request.401',
  403: 'request.403',
  404: 'request.404',
  406: 'request.406',
  410: 'request.410',
  422: 'request.422',
  500: 'request.500',
  502: 'request.502',
  503: 'request.503',
  504: 'request.504',
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // prefix: !REACT_APP_ENV ? 'http://10.109.207.82:8300' : 'http://pmo.lab.juxj.net',
  prefix: '/api',
  timeout: 180000,
  responseType: 'json',
  // 'paramsSerializer' 开发者可通过该函数对 params 做序列化（注意：此时传入的 params 为合并了 extends 中 params 参数的对象，如果传入的是 URLSearchParams 对象会转化为 Object 对象
  // paramsSerializer: function (params) {
  //   return Qs.stringify(params, { arrayFormat: 'brackets' })
  // },
  errorHandler, // 默认错误处理
});

/**
 * 请求拦截: 添加额外的headers
 */
request.interceptors.request.use((url, options: CustomRequestOptionsInit) => {
  const opts = options;
  const token = getToken();
  const locale = getLocale();

  // 定义headers
  opts.headers = options.headers || {};
  // 添加token
  if (token) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    opts.headers['Authorization'] = token;
  }

  // 添加locale
  if (locale) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    opts.headers['locale'] = locale || 'zh-CN';
  }

  // 故此处识别IE浏览器，禁用Get请求缓存
  if (isIE()) {
    opts.headers['Cache-Control'] = 'no-cache';
    // eslint-disable-next-line
    opts.headers['Pragma'] = 'no-cache';
  }

  return {
    url,
    options: opts,
  };
});

/**
 * 响应拦截
 */
request.interceptors.response.use(async (response, options: CustomRequestOptionsInit) => {
  const { autoMsg, fallback = true } = options;
  // 非正常返回，直接reject
  if (response.status < 200 || response.status >= 300) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ response });
  }

  // 非json数据（二进制文件、文本等）
  if (options.responseType !== 'json') {
    return response;
  }

  const result = (await response.json()) as ResultSet;

  const { error } = result;

  // 200 返回业务异常
  if (error?.code !== '0') {
    const errMsg = error.msg || error.extra?.join(', ') || error.code;
    if (typeof autoMsg === 'function' ? autoMsg(response.status) : autoMsg !== false) {
      message.error(errMsg);
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ response });
  }
  // no fallback
  if (!fallback) return result.data;

  // 200 返回正常数据
  // 服务端返回对象或数组均可能为null, 此处用空数组兜底
  const res = result.data !== null ? result.data : [];
  // 分页补全
  if (
    typeof options.data?.current === 'number' ||
    typeof options.params?.['current'] === 'number'
  ) {
    if (typeof res.total === 'number' && res.data === null) {
      (res as BaseTableListResponse<any>).data = [];
    }
  }
  return res;
});

/**
 * 异常处理程序
 */
async function errorHandler(error: { response: Response; request: any }): Promise<Response> {
  console.log('🚀 ~ file: request.ts:168 ~ errorHandler ~ error:', error);
  const { response } = error;
  const autoMsg = error.request?.options?.autoMsg as AutoMsgType;

  if (response && response.status && (response.status < 200 || response.status >= 300)) {
    /**
     * 服务端 500响应内定义的错误信息
     */
    const errorMessage = await getErrorResponseData(response);
    const errorText =
      errorMessage || formatMessage({ id: codeMessage[response.status] }) || response.statusText;
    const { status, url } = response;

    // 提示报错
    if (typeof autoMsg === 'function' ? autoMsg(response.status) : autoMsg !== false) {
      notification.error({
        message: `${formatMessage({
          id: 'request.error',
        })} ${status}: ${url}`,
        description: errorText,
      });
    }

    // 401退出登录操作
    const statusCode = response.status;
    if (statusCode === 401) {
      // const dvaApp = getDvaApp();
      // eslint-disable-next-line no-underscore-dangle
      // dvaApp._store.dispatch({
      //   type: 'userState/logout',
      //   payload: statusCode,
      // });
    }
  } else if (!response) {
    if (autoMsg !== false) {
      notification.error({
        description: formatMessage({ id: 'request.network-error-desc' }),
        message: formatMessage({ id: 'request.network-error' }),
      });
    }
  }
  return Promise.reject(response);
}

/**
 * 获取异常的错误信息
 * @param response
 */
async function getErrorResponseData(response: Response) {
  try {
    const result = (await response.json()) as ResultSet<string | ErrorMessage> | undefined;
    return typeof result?.error === 'string'
      ? result?.error
      : result?.error.msg || result?.error.extra?.join(', ') || result?.error.code;
  } catch (err) {
    return undefined;
  }
}

export default request;
