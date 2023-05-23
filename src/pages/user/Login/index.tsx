import { Image, Typography } from 'antd';
import React, { useState } from 'react';
import { history, SelectLang, useIntl, useModel } from 'umi';
import styles from './index.less';
import { LoginParams, login } from '@/services/permission/login';
import md5 from 'md5';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import { DefaultFooter } from '@ant-design/pro-components';
import BrowserVersionWarning from '@/layouts/shared/BrowserVersionWarning';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { formatMessage } = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values, password: md5(values.password), type: 'user' });
      console.log('🚀 ~ file: index.tsx:57 ~ handleSubmit ~ msg:', msg);
      // if (msg.status === 'ok') {
      //   const defaultLoginSuccessMessage = intl.formatMessage({
      //     id: 'pages.login.success',
      //     defaultMessage: '登录成功！',
      //   });
      //   message.success(defaultLoginSuccessMessage);
      //   await fetchUserInfo();
      //   /** 此方法会跳转到 redirect 参数所在的位置 */
      //   if (!history) return;
      //   const { query } = history.location;
      //   const { redirect } = query as { redirect: string };
      //   history.push(redirect || '/');
      //   return;
      // }
      // console.log(msg);
      // // 如果失败去设置用户错误信息
      // setUserLoginState(msg);
    } catch (error) {
      // const defaultLoginFailureMessage = intl.formatMessage({
      //   id: 'pages.login.failure',
      //   defaultMessage: '登录失败，请重试！',
      // });
      // message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang className={styles.selectLang} />
      </div>
      <div className={styles.content}>
        <div className={styles.linesContainer} />
        <div className={styles.contentInner}>
          <div className={styles['center--left']}>
            <div className={styles.imageWrapper}>
              <Image
                className={styles.image}
                src={require('./images/loginImage.png')}
                preview={false}
                width="100%"
              />
              <div className={styles.imageDecoration} />
            </div>
          </div>
          <div className={styles['center--right']}>
            <div className={styles.top}>
              <div className={styles.header}>
                <span className={styles.title}>
                  <Typography.Text>
                    <Texty>{formatMessage({ id: 'global.title' })}</Texty>
                  </Typography.Text>
                </span>
              </div>
            </div>
            <BrowserVersionWarning className={styles.browserWarning} fixed={false} />
          </div>
        </div>
        <DefaultFooter
          className={styles.footer}
          links={false}
          copyright={`${new Date().getFullYear()}`}
        />
      </div>
    </div>
  );
};

export default Login;
