/**
 * 是否是IE浏览器
 */
export function isIE() {
  return _isIEBrowser()();
}

// eslint-disable-next-line
function _isIEBrowser() {
  // 获取当前浏览器的用户代理字符串
  const ua = navigator.userAgent;
  let isIEBrowser: boolean;
  return () => {
    if (isIEBrowser !== undefined) return isIEBrowser;
    isIEBrowser = !!(
      ua.toLowerCase().match(/rv:([\d.]+)\) like gecko/) ||
      (ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1 && ua.indexOf('Opera') < 0)
    );
    return isIEBrowser;
  };
}
