/**
 * Created by evan on 16/1/10.
 */

//功能参考Ionic
class DomUtils {
  constructor() {
    // From the man himself, Mr. Paul Irish.
    // The requestAnimationFrame polyfill
    // Put it on window just to preserve its context
    // without having to use .call
    this._cancelAnimationFrame = window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame;
  }

  requestAnimationFrame(cb) {
    let _rAF = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) {
        setTimeout(callback, 16);
      };
    return _rAF(cb);
  }

  cancelAnimationFrame(requestId) {
    this._cancelAnimationFrame(requestId);
  }
}
const domUtils = new DomUtils();

class AppUtils {
  getPublicImageUrl(imageUrl, size) {
    if (!imageUrl) {
      return null;
    }
    //组装tfskey
    //特殊处理filegw返回的链接地址中如果带有.jpg .png .jpeg这类图片后缀的话,删除
    let suffix = imageUrl.substring(imageUrl.length - 4);
    if (suffix.charAt(0) === '.') {
      imageUrl = imageUrl.substring(0, imageUrl.length - 4);
      if (size) {
        imageUrl += '_' + size;
      }
      imageUrl += suffix;
    } else {
      suffix = imageUrl.substring(imageUrl.length - 5);
      if (suffix.charAt(0) === '.') {
        imageUrl = imageUrl.substring(0, imageUrl.length - 5);
        if (size) {
          imageUrl += '_' + size;
        }
        imageUrl += suffix;
      } else {
        if (size) {
          imageUrl += '_' + size;
        }
      }
    }
    return Settings.FILES_PUBLIC + '/' + imageUrl;
  }

  getPrivateImageUrl(imageToken){
    if(!imageToken){
      return null;
    }
    return Settings.FILES_PRIVATE + encodeURIComponent(imageToken);
  }

  dateFormat(timeStamp, mode) {
    let format = mode || 'yyyy-MM-dd hh:mm:ss',
      date = new Date(parseInt(timeStamp)),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds(),
      weekday = date.getDay();

    function getWeekDayNameByNumber(number) {
      let re = null;
      switch (number) {
        case 0:
          re = '日';
          break;
        case 1:
          re = '一';
          break;
        case 2:
          re = '二';
          break;
        case 3:
          re = '三';
          break;
        case 4:
          re = '四';
          break;
        case 5:
          re = '五';
          break;
        case 6:
          re = '六';
          break;
      }
      return re || number;
    }

    let results = format.replace(/yyyy/g, year)
      .replace(/MM/g, month < 10 ? '0' + month : month)
      .replace(/dd/g, day < 10 ? '0' + day : day)
      .replace(/hh/g, hours < 10 ? '0' + hours : hours)
      .replace(/mm/g, minutes < 10 ? '0' + minutes : minutes)
      .replace(/ss/g, seconds < 10 ? '0' + seconds : seconds)
      .replace(/WW/g, getWeekDayNameByNumber(weekday));

    return results;
  }
}
const appUtils = new AppUtils();

class LocalStorage {
  setObject(key, value) {
    if (window.localStorage) {
      window.localStorage[key] = JSON.stringify(value);
    }
  }
  getObject(key) {
    let obj = window.localStorage[key];
    try {
      return obj ? JSON.parse(obj) : null;
    } catch (e) {
      return null;
    }
  }
  remove(key) {
    delete window.localStorage[key];
  }
}
const lStorage = new LocalStorage();

class SessionStorage {
  setObject(key, value) {
    if (window.sessionStorage) {
      window.sessionStorage[key] = JSON.stringify(value);
    }
  }
  getObject(key) {
    let obj = window.sessionStorage[key];
    try {
      return obj ? JSON.parse(obj) : null;
    } catch (e) {
      return null;
    }
  }
  remove(key) {
    delete window.sessionStorage[key];
  }
}
const sStorage = new SessionStorage();

export {
  domUtils as DomUtils, appUtils as AppUtils, lStorage as LocalStorage, sStorage as SessionStorage
};
