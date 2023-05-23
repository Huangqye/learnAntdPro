import React from 'react';
import { isIE } from '@/utils/browserVersion';
import classNames from 'classnames';
import styles from './BrowserVersionWarning.less';

export interface BrowserVersionWarningProps {
  fixed?: boolean;
}

const BrowserVersionWarning: React.FC<
  BrowserVersionWarningProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { fixed = true } = props;
  return isIE() ? (
    <div
      className={classNames(
        styles.browserWarning,
        {
          [styles.fixed]: fixed,
        },
        props.className,
      )}
      style={props.style}
    >
      请使用 Chrome <img alt="chrome" width={30} src={require('../images/chrome.svg')} /> 、Edge{' '}
      <img width={28} alt="Microsoft Edge" src={require('../images/Edge.svg')} /> 或 Firefox{' '}
      <img width={28} alt="Firefox" src={require('../images/firefox.svg')} />{' '}
      浏览器访问本系统以获得正常的浏览体验
    </div>
  ) : null;
};

export default BrowserVersionWarning;
