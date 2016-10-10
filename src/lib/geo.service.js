/**
 * Created by lusc on 16/8/22.
 */
import Cookie from 'react-cookie';
import {Promise} from 'es6-promise';
import _IsEmpty from 'lodash/isEmpty';
import CordovaService from '../lib/cordova.service';
import NavigatorService from '../lib/navigator.service';

class GeoService {

  constructor() {
    return new Promise((resolve, reject) => {
      let coords = Cookie.load('_geolocation');
      if (_IsEmpty(coords)) { //如果定位缓存不存在，则请求定位信息
        this._getCoords(resolve, reject);
      } else {
        return resolve(coords);
      }
    });
  }

  _setCookie(coords) { //缓存到cookie，过期时间一刻钟
    let expires = new Date();
    expires.setTime(expires.getTime() + 15 * 60 * 1000);
    Cookie.save('_geolocation', coords, {expires: expires});
  }

  _getCoords(resolve, reject) {
    if (NavigatorService.isPajkDoctorApp()) { //如果在主客内，则取native定位
      CordovaService.api(4, 1, null).then(res => {
        let coords = {
          latitude: res.lat,
          longitude: res.lon
        };
        this._setCookie(coords);
        return resolve(coords);
      }).catch(e => {
        return reject(e);
      });
    } else if (navigator.geolocation) { //h5 定位
      navigator.geolocation.getCurrentPosition(position => {
        if (position && position.coords) {
          let coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this._setCookie(coords);
          return resolve(coords);
        }
      }, e => {
        return reject(e);
      }, {timeout: 5000});
    }
  }
}

export default new GeoService();
