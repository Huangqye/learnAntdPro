import type { CustomRequestOptionsInit } from '@/utils/request';
import request from '@/utils/request';

/**
 * 登录参数
 */
export interface LoginParams {
  // 域控的用户名
  userName: string;
  // 登录密码 min: 5
  password: string;
  type: string;
}

/**
 * 登录用户信息
 */
export interface LoginUser {
  gid: string;
  enName: string;
  chnName: string;
  admin: boolean;
  companyId: string;
  employeeId: string;
  token: string;
}

/** Logs user into the system GET /user/login */
export async function login(body: LoginParams, options?: CustomRequestOptionsInit) {
  return request<LoginUser>('/permission/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
