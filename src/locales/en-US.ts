import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';

export default {
  // 全局定义
  'global.query': 'Query',
  'global.clear': 'Clear',
  'global.cancel': 'Cancel',
  'global.confirm': 'OK',
  'global.title': 'Yizit EQMS V1.4',
  'global.select-all': 'Select All',
  'global.portfolio': 'Portfolio',
  'global.page-items-total': '{total} Records Total',
  'global.action': 'Operate',
  'global.system-config': 'System Config',

  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'Produced by Ant Financial Experience Department',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
