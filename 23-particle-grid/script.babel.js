"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cvs = document.querySelector('#cvs');
/* 粒子 */

var Particle = /*#__PURE__*/function () {
  // 半径
  // 横坐标
  // 纵坐标
  // 水平速度
  // 垂直速度
  // 水平加速度
  // 垂直加速度
  function Particle(_ref) {
    var _ref$isMouse = _ref.isMouse,
        isMouse = _ref$isMouse === void 0 ? false : _ref$isMouse,
        cvsCtx = _ref.cvsCtx,
        x = _ref.x,
        y = _ref.y,
        vx = _ref.vx,
        vy = _ref.vy;

    _classCallCheck(this, Particle);

    _defineProperty(this, "cvsCtx", null);

    _defineProperty(this, "r", 1);

    _defineProperty(this, "x", 0);

    _defineProperty(this, "y", 0);

    _defineProperty(this, "vx", 0);

    _defineProperty(this, "vy", 0);

    _defineProperty(this, "ax", 0);

    _defineProperty(this, "ay", 0);

    _defineProperty(this, "lastTime", 0);

    _defineProperty(this, "isMouse", false);

    this.isMouse = isMouse;
    this.cvsCtx = cvsCtx;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.lastTime = Date.now();
  }

  _createClass(Particle, [{
    key: "render",
    value: function render() {
      if (!this.isMouse) {
        var cvsCtx = this.cvsCtx,
            r = this.r,
            vx = this.vx,
            vy = this.vy,
            ax = this.ax,
            ay = this.ay,
            lastTime = this.lastTime;
        var t = (Date.now() - lastTime) / 1000;
        this.x += vx * t + ax * Math.pow(t, 2) * 0.5;
        this.y += vy * t + ay * Math.pow(t, 2) * 0.5; // this.vx += ax * t;
        // this.vy += ay * t;

        cvsCtx.beginPath();
        cvsCtx.fillStyle = 'rgba(255,255,255,1)';
        cvsCtx.arc(this.x, this.y, r, 0, Math.PI * 2, false);
        cvsCtx.fill();
        cvsCtx.closePath();
      }

      this.lastTime = Date.now();
    }
  }]);

  return Particle;
}();
/* 粒子网格 */


var ParticleGrid = /*#__PURE__*/function () {
  _createClass(ParticleGrid, [{
    key: "total",
    get: function get() {
      return Math.pow(this.width * this.height, 0.5) * 0.24;
    }
  }, {
    key: "randomParticle",
    get: function get() {
      var cvsCtx = this.cvsCtx,
          width = this.width,
          height = this.height,
          speed = this.speed,
          connectDistance = this.connectDistance;
      var x, y, rad;
      var i = Math.floor(Math.random() * 4);

      switch (i) {
        case 0:
          rad = Math.random() * Math.PI;
          x = Math.random() * (width + 2 * connectDistance) - connectDistance;
          y = -connectDistance;
          break;

        case 1:
          rad = (Math.random() + 0.5) * Math.PI;
          x = width + connectDistance;
          y = Math.random() * (height + 2 * connectDistance) - connectDistance;
          break;

        case 2:
          rad = (Math.random() - 1) * Math.PI;
          x = Math.random() * (width + 2 * connectDistance) - connectDistance;
          y = height + connectDistance;
          break;

        case 3:
          rad = (Math.random() - 0.5) * Math.PI;
          x = -connectDistance;
          y = Math.random() * (height + 2 * connectDistance) - connectDistance;
          break;
      }

      return new Particle({
        cvsCtx: cvsCtx,
        x: x,
        y: y,
        vx: Math.cos(rad) * speed,
        vy: Math.sin(rad) * speed
      });
    }
  }]);

  function ParticleGrid(cvs) {
    var _this = this;

    _classCallCheck(this, ParticleGrid);

    _defineProperty(this, "cvs", null);

    _defineProperty(this, "cvsCtx", null);

    _defineProperty(this, "width", 0);

    _defineProperty(this, "height", 0);

    _defineProperty(this, "speed", 100);

    _defineProperty(this, "connectDistance", 200);

    _defineProperty(this, "particles", []);

    _defineProperty(this, "flag", false);

    _defineProperty(this, "_onEnterFrame", function () {
      var cvsCtx = _this.cvsCtx,
          width = _this.width,
          height = _this.height,
          connectDistance = _this.connectDistance;
      cvsCtx.clearRect(0, 0, width, height);
      cvsCtx.fillStyle = '#000000';
      cvsCtx.fillRect(0, 0, width, height);
      _this.particles = _this.particles.filter(function (item) {
        var x = item.x,
            y = item.y;
        var alive = x >= -connectDistance && y >= -connectDistance && x <= width + connectDistance && y <= height + connectDistance;
        return alive && item.render(), alive;
      });

      for (var i = 0; i < _this.total - _this.particles.length; i++) {
        _this.particles.push(_this.randomParticle);
      }

      _this._interact();

      requestAnimationFrame(_this._onEnterFrame);
    });

    _defineProperty(this, "_onMouseMove", function (e) {
      var x = e.offsetX,
          y = e.offsetY;
      var width = _this.width,
          height = _this.height,
          _this$cvs = _this.cvs,
          w = _this$cvs.offsetWidth,
          h = _this$cvs.offsetHeight;
      var mouse = _this.particles[0];
      mouse.isMouse = true;
      mouse.x = x * (width / w);
      mouse.y = y * (height / h);
    });

    _defineProperty(this, "_onClick", function (e) {
      _this.flag = !_this.flag;
    });

    this.cvs = cvs;
    this.cvsCtx = cvs.getContext('2d');
    this.width = this.cvs.width = 2560;
    this.height = this.cvs.height = 1440;
    this.width = this.cvs.width = cvs.offsetWidth * window.devicePixelRatio;
    this.height = this.cvs.height = cvs.offsetHeight * window.devicePixelRatio;
    window.addEventListener('resize', function () {
      _this.width = _this.cvs.width = cvs.offsetWidth * window.devicePixelRatio;
      _this.height = _this.cvs.height = cvs.offsetHeight * window.devicePixelRatio;
    });

    this._init();

    this._onEnterFrame();
  }

  _createClass(ParticleGrid, [{
    key: "_init",
    value: function _init() {
      var cvs = this.cvs,
          cvsCtx = this.cvsCtx,
          width = this.width,
          height = this.height,
          speed = this.speed,
          connectDistance = this.connectDistance;
      this.particles[0] = new Particle({
        cvsCtx: cvsCtx,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
      });

      for (var i = 1; i < this.total; i++) {
        var rad = (Math.random() * 2 - 1) * Math.PI;
        this.particles[i] = new Particle({
          cvsCtx: cvsCtx,
          x: Math.random() * (width + 2 * connectDistance) - connectDistance,
          y: Math.random() * (height + 2 * connectDistance) - connectDistance,
          vx: Math.cos(rad) * speed,
          vy: Math.sin(rad) * speed
        });
      }

      cvs.addEventListener('mousemove', this._onMouseMove);
      cvs.addEventListener('click', this._onClick);
    }
  }, {
    key: "_interact",
    value: function _interact() {
      var cvsCtx = this.cvsCtx,
          particles = this.particles,
          connectDistance = this.connectDistance,
          flag = this.flag;
      var l = particles.length;

      for (var i = 0; i < l - 1; i++) {
        var a = particles[i];

        for (var j = i + 1; j < l; j++) {
          var b = particles[j];
          var d = Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), 0.5);

          if (a.isMouse) {
            var r = flag ? connectDistance : connectDistance * 0.6;

            if (d <= r * (flag ? 1 : 2)) {
              var c = flag ? 40000 : 20000;
              var rad = Math.atan2(a.y - b.y, a.x - b.x);
              b.ax = Math.cos(rad) * c * ((d - r) / r);
              b.ay = Math.sin(rad) * c * ((d - r) / r);
            } else {
              b.ax = 0;
              b.ay = 0;
            }
          }
          /* 连线 */


          if (d <= connectDistance) {
            cvsCtx.beginPath();
            cvsCtx.lineWidth = 1;
            cvsCtx.lineCap = 'round';
            cvsCtx.strokeStyle = "rgba(255,255,255,".concat(1 - d / connectDistance, ")");
            cvsCtx.moveTo(a.x, a.y);
            cvsCtx.lineTo(b.x, b.y);
            cvsCtx.stroke();
            cvsCtx.closePath();
          }
        }
      }
    }
  }]);

  return ParticleGrid;
}();

new ParticleGrid(cvs);
//# sourceMappingURL=script.babel.js.map