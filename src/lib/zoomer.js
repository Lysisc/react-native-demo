/**
 * Created by lusc on 16/8/12.
 */

//zoomer.js
class Zoomer {
  constructor(config) {
    setTimeout(() => {
      this._initTouchesListener(config);
    }, 0);
  }

  _initTouchesListener(config) {
    if (/^\./.test(config.element)) {
      this.imageTag = document.querySelector(config.element);
    } else if (/^#/.test(config.element)) {
      this.imageTag = document.getElementById(config.element.replace('#', ''));
    } else if (config.element.nodeName.toLowerCase() === 'img') {
      this.imageTag = config.element;
    }
    if (this.imageTag) {
      this.config = {
        minScale: config.minScale || 1,
        maxScale: config.maxScale || (this.imageTag.naturalWidth / this.imageTag.clientWidth).toFixed(2)
      };
      this.param = {
        startLeft: 0,
        endLeft: 0,
        startTop: 0,
        endTop: 0,
        startSize: 0,
        endSize: 1,
        imageTop: 0,
        imageLeft: 0,
        imageScale: 1,
        singleTouchTimer: null,
        singleTouchEnable: true
      }
      this.imageTag.addEventListener('touchstart', e => this._touchesEventTrigger(e));
      this.imageTag.addEventListener('touchmove', e => this._touchesEventTrigger(e));
      this.imageTag.addEventListener('touchend', e => this._touchesEventTrigger(e));
    }
  }

  _touchesEventTrigger(e) {
    let t1 = e.touches[0],
      t2 = e.touches[1],
      size = 0;

    if (t1 && t2 && !e.touches[2]) {
      size = Math.abs(t1.clientX - t2.clientX) * Math.abs(t1.clientY - t2.clientY);
    }

    switch (e.type) {
      case 'touchstart':
        if (t2) {
          this.param.startSize = size;
          this.param.singleTouchEnable = false;
        } else {
          this.param.startLeft = t1.clientX;
          this.param.startTop = t1.clientY;
        }
        break;
      case 'touchmove':
        if (t2) {
          this._changeImageSize(this.param.startSize, size);
        } else if (this.param.singleTouchEnable) {
          let left = t1.clientX - this.param.startLeft,
            top = t1.clientY - this.param.startTop;
          this._changeImageOffset(left, top);
        }
        this._setImageStyle();
        break;
      case 'touchend':
        clearTimeout(this.param.singleTouchTimer);
        setTimeout(() => {
          this._touchesEventEnd();
          this.param.singleTouchTimer = setTimeout(() => {
            this.param.singleTouchEnable = true;
          }, 256);
        }, 96);
        break;
    }
  }

  _setImageStyle() {
    this.imageTag.style.cssText = `transform: scale(${this.param.imageScale})  translate3d(${this.param.imageLeft}px, ${this.param.imageTop}px, 0); -webkit-transform: scale(${this.param.imageScale})  translate3d(${this.param.imageLeft}px, ${this.param.imageTop}px, 0)`;
  }

  _touchesEventEnd() {
    this.param.endSize = this.param.imageScale;
    if (this.imageTag.clientWidth * this.param.endSize <= window.innerWidth) {
      this.param.imageLeft = 0;
    }
    if (this.imageTag.clientHeight * this.param.endSize <= window.innerHeight) {
      this.param.imageTop = 0;
    }
    if (this.param.singleTouchEnable) {
      this.param.endLeft = this.param.imageLeft;
      this.param.endTop = this.param.imageTop;
    }
    this._setImageStyle();
  }

  _changeImageSize(startSize, changeSize) {
    if (startSize && changeSize) {
      let scale = (changeSize / startSize).toFixed(2) * this.param.endSize;
      if (scale < this.config.minScale) {
        this.param.imageScale = this.config.minScale;
      } else if (scale > this.config.maxScale) {
        this.param.imageScale = this.config.maxScale;
      } else {
        this.param.imageScale = scale;
      }
    }
  }

  _changeImageOffset(left, top) {
    let x = this.param.imageScale,
      w = this.imageTag.clientWidth * x,
      h = this.imageTag.clientHeight * x;

    if (w > window.innerWidth) {
      let ol = left + this.param.endLeft,
        range = (w - window.innerWidth) / (2 * x);
      if (ol >= range) {
        this.param.imageLeft = range;
      } else if (ol <= -range) {
        this.param.imageLeft = -range;
      } else {
        this.param.imageLeft = ol;
      }
    } else {
      this.param.imageLeft = 0;
    }

    if (h > window.innerHeight) {
      let ot = top + this.param.endTop,
        range = (h - window.innerHeight) / (2 * x);
      if (ot >= range) {
        this.param.imageTop = range;
      } else if (ot <= -range) {
        this.param.imageTop = -range;
      } else {
        this.param.imageTop = ot;
      }
    } else {
      this.param.imageTop = 0;
    }

  }

}

export default Zoomer;
