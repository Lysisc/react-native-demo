/**
 * Created by lusc on 16/8/22.
 */
import {Promise} from 'es6-promise';
import NavigatorService from './navigator.service';

class CordovaService {
  api(action, type, data, source) {
    return new Promise((resolve, reject) => {
      if (!NavigatorService.isPajkDoctorApp()) {
        return reject('不在主客APP内！');
      }

      let options = {
        action: action,
        type: type,
        data: data,
        source: source || 1
      };

      document.addEventListener('deviceready', () => {
        try {
          pajkPostMessage(data => {
            resolve(data);
          }, data => {
            reject(data);
          }, options);
        } catch (e) {
          reject(e);
        }
      }, false);
    });
  }

  setNativeTitle(title) {
    this.api(9, 9, {title: title});
  }

}

export default new CordovaService();
