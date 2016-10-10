/**
 * Created by lusc on 16/6/2.
 */

import React from 'react'; //for loadingBar的children
import Cookie from 'react-cookie';
// import {polyfill} from 'es6-promise'; //把Promise作为全局变量
import {Promise} from 'es6-promise';
import Fetch from 'isomorphic-fetch';
import Md5 from 'md5';
import PubSub from 'pubsub-js';
import CordovaService from './cordova.service';
import NavigatorService from './navigator.service';

/**
 * API服务
 * <code>
 * import ApiService from 'lib/api.service';
 * ApiService
 * .request({
 * _mt:'<API METHOD>',
 * },
 * true,//如果需要通过wtk数字签名
 * {})
 * .done(function(result){
 * //your code!!
 * });
 * </code>
 */
class ApiService {
  /**
   * loadingBar
   */
  loadingBar(isShow) {
    if (isShow) {
      PubSub.publish('toast.show', {
        className: 'loading',
        children: (
          <span className="icon-load-d"></span>
        ),
        autoHide: false
      });
    } else {
      PubSub.publish('toast.hide');
    }
  }

  /**
   * 服务加密函数
   * @param data
   * @param withUserAuth
   * @returns {{}}
   * @private
   */
  _encrypt(data, withUserAuth) {
    let baseObj = {
      //'_aid': Globals.APP_ID,
      //'_vc': Globals.VERSION_CODE,
      '_sm': 'md5'
    };

    let mergeObj = {};
    Object.assign(mergeObj, baseObj, data);

    let s = '',
      params = '',
      keys = [];

    for (let k in mergeObj) {
      keys.push(k);
    }

    keys.sort();

    for (let i = 0; i < keys.length; i++) {
      if (typeof mergeObj[keys[i]] !== 'undefined') {
        let k = keys[i],
          v = typeof mergeObj[k] === 'object'
            ? JSON.stringify(mergeObj[k])
            : mergeObj[k];
        s += k + '=' + v;
        params += encodeURIComponent(k) + '=' + encodeURIComponent(v) + '&';
      }
    }

    if (withUserAuth) {
      let c = Cookie.load('_wtk');
      c && (s += c);
    } else {
      s += 'jk.pingan.com';
    }

    params += '_sig=' + Md5(s);
    console.info(params);

    return params;
  }

  /**
   * 服务请求函数
   * 支持Promise
   * @param data
   * @param withUserAuth
   * @param settings
   * @returns {Promise}
   */
  request(data, withUserAuth = false, settings) {
    let params = this._encrypt(data, withUserAuth),
      api = new Request(Settings.API + '?' + params),
      config = settings || {};

    config.credentials = 'include';
    if (!config.noloading) {
      this.loadingBar(true);
    }

    return new Promise((resolve, reject) => {
      Fetch(api, config).then(res => {
        return res.json();
      }).then(data => {
        this.loadingBar();
        console.info(data.content && data.content[0] || data);
        if (data) { //增加API错误处理
          let stat = data.stat;
          if ((!config.hasOwnProperty('ignoreError') || !config.ignoreError) && (stat.code !== 0 || stat.stateList[0].code !== 0)) {

            if (stat.code === -300 || stat.code === -320 || stat.code === -340 || stat.code === -180 || stat.code === -360) {
              if (NavigatorService.isPajkDoctorApp()) {
                CordovaService.api(8, 2);
              } else {
                PubSub.publish('toast.show', {text: '登录状态异常'});
                setTimeout(() => {
                  window.location.replace(Settings.DP_HOST + '/#/login?returnUrl=' + encodeURIComponent(window.location.href));
                }, 3000);
              }
            }

            return reject(data);
          }
        }
        return resolve(data.content && data.content[0] || data);
      }).catch(e => {
        this.loadingBar();
        return reject(e);
      });
    });
  }
}

export default new ApiService();
