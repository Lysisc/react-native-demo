/**
 * Created by evan on 16/1/13.
 */
import NavigatorService from './navigator.service';
import {DomUtils} from './utils';

const IOS = 'ios';
const ANDROID = 'android';

//Platform判断逻辑参考Ionic
class Platform {

  constructor() {
    this.platformName = null;
    this.platformVersion = null;

    this.platforms = [];
    this.navigatorPlatform = NavigatorService.getPlatform();

    this.viewportTag;
    this.viewportProperties = {};
  }

  detect() {
    this._checkPlatforms();
    function addDocumentBodyClassList() {
      // only add to the body class if we got platform info
      for (var i = 0; i < this.platforms.length; i++) {
        document.body.classList.add('platform-' + this.platforms[i]);
      }
      //alert(document.body.classList);
    }

    DomUtils.requestAnimationFrame(addDocumentBodyClassList.bind(this));
  }

  _checkPlatforms() {
    this.platforms = [];

    if (this.isWebView()) {
      this.platforms.push('webview');
      if (!(!window.cordova && !window.PhoneGap && !window.phonegap)) {
        this.platforms.push('cordova');
      } else if (NavigatorService.isPajkDoctorApp()) {
        //如果cordova不存在的情况下,主客特殊处理
        this.platforms.push('cordova');
      }
    } else if (NavigatorService.isPajkDoctorApp()) {
      //如果cordova不存在的情况下,主客特殊处理
      this.platforms.push('webview');
      this.platforms.push('cordova');
    } else {
      this.platforms.push('browser');
    }

    if (this.navigatorPlatform.iPad) {
      this.platforms.push('ipad');
    }

    var platform = this.platform();
    if (platform) {
      this.platforms.push(platform);

      var version = this.version();
      if (version) {
        var v = version.toString();
        if (v.indexOf('.') > 0) {
          v = v.replace('.', '_');
        } else {
          v += '_0';
        }
        this.platforms.push(platform + v.split('_')[0]);
        this.platforms.push(platform + v);
      }
    }
  }

  isWebView() {
    return !(!window.cordova && !window.PhoneGap && !window.phonegap && !window.forge)
  }

  platform() {
    // singleton to get the platform name
    if (this.platformName === null) this.setPlatform();
    return this.platformName;
  }

  setPlatform(n) {
    if (typeof n != 'undefined' && n !== null && n.length) {
      this.platformName = n.toLowerCase();
    } else if (this.navigatorPlatform.Android) {
      this.platformName = ANDROID;
    } else if (this.navigatorPlatform.iOS || this.navigatorPlatform.iPhone || this.navigatorPlatform.iPad) {
      this.platformName = IOS;
    } else {
      this.platformName = window.navigator.platform && navigator.platform.toLowerCase().split(' ')[0] || '';
    }
  }

  version() {
    // singleton to get the platform version
    if (this.platformVersion === null) this.setVersion();
    return this.platformVersion;
  }

  setVersion(v) {
    if (typeof v != 'undefined' && v !== null) {
      v = v.split('.');
      v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
      if (!isNaN(v)) {
        this.platformVersion = v;
        return;
      }
    }

    this.platformVersion = 0;

    // fallback to user-agent checking
    var pName = this.platform();
    var versionMatch = {
      'android': /Android (\d+).(\d+)?/,
      'ios': /OS (\d+)_(\d+)?/,
      'windowsphone': /Windows Phone (\d+).(\d+)?/
    };
    if (versionMatch[pName]) {
      v = NavigatorService.getUserAgent().match(versionMatch[pName]);
      if (v && v.length > 2) {
        this.platformVersion = parseFloat(v[1] + '.' + v[2]);
      }
    }
  }

  //ViewPort相关功能
  viewportLoadTag() {
    var x;
    for (x = 0; x < document.head.children.length; x++) {
      if (document.head.children[x].name == 'viewport') {
        this.viewportTag = document.head.children[x];
        break;
      }
    }
    if (this.viewportTag) {
      var props = this.viewportTag.content.toLowerCase().replace(/\s+/g, '').split(
        ',');
      var keyValue;
      for (x = 0; x < props.length; x++) {
        if (props[x]) {
          keyValue = props[x].split('=');
          this.viewportProperties[keyValue[0]] = (keyValue.length > 1 ? keyValue[1] :
            '_');
        }
      }
      this.viewportUpdate();
    }
  }

  orientation() {
    // 0 = Portrait
    // 90 = Landscape
    // not using window.orientation because each device has a different implementation
    return (window.innerWidth > window.innerHeight ? 90 : 0);
  }

  viewportUpdate() {
    // unit tests in viewport.unit.js
    var initWidth = this.viewportProperties.width;
    var initHeight = this.viewportProperties.height;
    var version = this.version();
    var DEVICE_WIDTH = 'device-width';
    var DEVICE_HEIGHT = 'device-height';
    var orientation = this.orientation();

    // Most times we're removing the height and adding the width
    // So this is the default to start with, then modify per platform/version/oreintation
    delete this.viewportProperties.height;
    this.viewportProperties.width = DEVICE_WIDTH;
    if (this.navigatorPlatform.iPad) {
      // iPad
      if (version > 7) {
        // iPad >= 7.1
        // https://issues.apache.org/jira/browse/CB-4323
        delete this.viewportProperties.width;
      } else {
        // iPad <= 7.0
        if (this.isWebView()) {
          // iPad <= 7.0 WebView
          if (orientation == 90) {
            // iPad <= 7.0 WebView Landscape
            this.viewportProperties.height = '0';
          } else if (version == 7) {
            // iPad <= 7.0 WebView Portait
            this.viewportProperties.height = DEVICE_HEIGHT;
          }
        } else {
          // iPad <= 6.1 Browser
          if (version < 7) {
            this.viewportProperties.height = '0';
          }
        }
      }
    } else if (this.navigatorPlatform.iOS) {
      // iPhone
      if (this.isWebView()) {
        // iPhone WebView
        if (version > 7) {
          // iPhone >= 7.1 WebView
          delete this.viewportProperties.width;
        } else if (version < 7) {
          // iPhone <= 6.1 WebView
          // if height was set it needs to get removed with this hack for <= 6.1
          if (initHeight) this.viewportProperties.height = '0';
        } else if (version == 7) {
          //iPhone == 7.0 WebView
          this.viewportProperties.height = DEVICE_HEIGHT;
        }
      } else {
        // iPhone Browser
        if (version < 7) {
          // iPhone <= 6.1 Browser
          // if height was set it needs to get removed with this hack for <= 6.1
          if (initHeight) this.viewportProperties.height = '0';
        }
      }
    }
    // only update the viewport tag if there was a change
    if (initWidth !== this.viewportProperties.width || initHeight !==
      this.viewportProperties.height) {
      this.viewportTagUpdate();
    }
  }

  viewportTagUpdate() {
    var key, props = [];
    for (key in this.viewportProperties) {
      if (this.viewportProperties[key]) {
        props.push(key + (this.viewportProperties[key] == '_' ? '' : '=' +
          this.viewportProperties[key]));
      }
    }
    this.viewportTag.content = props.join(', ');
  }
}

export default new Platform();
