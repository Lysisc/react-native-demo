/**
 * Created by evan on 15/11/28.
 */
import Cookie from 'react-cookie';

class NavigatorService {

  getPlatform() {
    var u = this.getUserAgent();
    return {
      WebKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      Mobile: !!u.match(/AppleWebKit.*Mobile.*!/) || !!u.match(/AppleWebKit/), //是否为移动终端
      iOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      Android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1 //是否iPad
    }
  }

  containSpecificUA(specUA) {
    var u = this.getUserAgent();
    return u.toLowerCase().indexOf(specUA) !== -1;
  }

  getUserAgent() {
    return window.navigator.userAgent;
  }

  isPajkDoctorApp() {
    return this.containSpecificUA('pajkcordova');
  }

  isPajkNativeTopHidden() {
    return this.containSpecificUA('pajkcordova') && Cookie.load('native_topbar_is_hidden') == '1';
  }
}

export default new NavigatorService();
