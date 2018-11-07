/* jSignature
 * by F 
 * date 2017-06-25
 * version 1.0.0
 */
/**/
require("./css/jSignature.css");
require("./css/iconfont/iconfont.css");
import html2canvas from "html2canvas";
window._$ = require("./js/fun.js");
const signature = require("./js/signature.js");
import Picker from "vanilla-picker";

(function(_win, undefined) {
  "use strict";
  /***************
   * by javascript
   **************/

  var defaults = {
    btnStart: "#btnStart",
    lineColor: "#000000",
    lineWidth: 4,
    background: "#FFFFFF",
    onBefore: null,
    onStart: null,
    onDraging: null,
    onClose: null,
    onEnd: null
  };

  function jSignature(id, options) {
    // DOM elements/objects
    this.html = document.getElementsByTagName("html")[0];
    this.element = document.getElementById(id);
    this.settings = _$.extend(defaults, options);
    this.btnStart = [];
    var selecterList = this.settings.btnStart.split(",");
    for (var i = 0; i < selecterList.length; i++) {
      this.btnStart.push(document.querySelector(selecterList[i]));
    }
    this.isPc = !navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    this.ev = {
      click: this.isPc ? "click" : "touchstart"
    };
    this.init();
  }

  jSignature.prototype = {
    init: function() {
      var that = this;
      this.createPopup();
      if (this.btnStart.length) {
        for (var i = 0; i < this.btnStart.length; i++) {
          this.btnStart[i] &&
            _$.addEvent(this.btnStart[i], this.ev.click, function() {
              that.setup(that);
            });
        }
      }
    },
    createPopup: function() {
      this.popup = document.createElement("div");
      this.popup.className = "jSignature-popup";
      this.popup.innerHTML =
        '<div class="jSignature-popup-scroll">\
            <div class="jSignature-popup-content">\
              <canvas style="background:#fff"></canvas>\
              <div class="jSignature-popup-mask"></div>\
            </div>\
          </div>\
          <div class="jSignature-popup-controls">\
            <a class="jSignature-popup-controls-signature"><i class="icon iconfont icon-yumaobi"></i></a>\
            <a class="jSignature-popup-controls-stroke">\
              <i style="width:' +
        this.settings.lineWidth +
        'px"></i>\
              <ul><li></li><li></li><li></li><li></li><li></li><li></li></ul>\
            </a>\
            <a class="jSignature-popup-controls-color"><i></i></a>\
            <a class="jSignature-popup-controls-clear"><i class="icon iconfont icon-saoba"></i></a>\
            <a class="jSignature-popup-controls-cancel"><i class="icon iconfont icon-cross"></i></a>\
            <a class="jSignature-popup-controls-save"><i class="icon iconfont icon-queding"></i></a>\
          </div>';
      document.body.appendChild(this.popup);
      this.addEvent();
    },
    addEvent: function() {
      var that = this;
      var popupScroll = _$.children(this.popup)[0];
      var popupContent = _$.children(popupScroll)[0];
      var popupCanvas = _$.children(popupContent)[0];
      var popupControls = _$.children(this.popup)[1];
      var btns = _$.children(popupControls);
      this.popupCanvas = popupCanvas;
      var _stroke = _$.children(
        popupControls,
        ".jSignature-popup-controls-stroke"
      )[0];
      this.stroke = {
        self: _stroke,
        icon: _$.children(_stroke)[0],
        list: _$.children(_$.children(_stroke)[1]),
        value: this.settings.lineWidth
      };

      this.mySignature = new signature(popupCanvas, {
        lineColor: this.settings.lineColor,
        lineWidth: this.settings.lineWidth,
        background: this.settings.background,
        autoFit: false,
        onDraging: this.settings.onDraging
      });

      var mainScrollLeft = 0;
      var mainScrollTop = 0;
      var signatureIng = false;
      var left = null;
      var top = null;
      var closePopup = function() {
        mainScrollLeft = 0;
        mainScrollTop = 0;
        signatureIng = false;
        left = null;
        top = null;
        popupScroll.style = "";
        _$.removeClass("jSignature-popup-open", that.html);
        that.mySignature.clearCanvas();
      };
      var fn = [
        // 签字笔
        function() {
          _$.toggleClass("jSignature-popup-signature", that.popup);
          if (signatureIng) {
            popupScroll.style.marginLeft = 0;
            popupScroll.style.marginTop = 0;
            popupScroll.scrollLeft = left;
            popupScroll.scrollTop = top;
            _$.removeEvent(document, "mousemove touchmove", that.noScroll);
          } else {
            left = mainScrollLeft;
            top = mainScrollTop;
            popupScroll.scrollLeft = 0;
            popupScroll.scrollTop = 0;
            popupScroll.style.marginLeft = -left + "px";
            popupScroll.style.marginTop = -top + "px";
            _$.addEvent(document, "mousemove touchmove", that.noScroll);
          }
          signatureIng = !signatureIng;
        },

        // 画笔粗细
        function() {
          _$.toggleClass("jSignature-popup-stroke", that.popup);
        },

        // 画笔颜色
        function() {
          _$.toggleClass("jSignature-popup-color", that.popup);
        },

        // 清除
        function() {
          that.mySignature.backtoCanvas();
        },

        // 关闭
        function() {
          that.settings.onClose && that.settings.onClose();
          closePopup();
        },

        // 确认
        function() {
          that.settings.onEnd &&
            that.settings.onEnd(that.mySignature.getDataURL());
          closePopup();
        }
      ];

      for (var i = 0; i < btns.length; i++) {
        _$.addEvent(btns[i], this.ev.click, fn[i]);

        (function(k) {
          if (
            btns[k].className.indexOf("jSignature-popup-controls-color") != -1
          ) {
            that.picker = new Picker({
              parent: btns[k],
              popup: "top",
              onChange: function(color) {
                btns[k].style.color = color.rgbaString;
                that.mySignature.resetCanvas({
                  lineColor: color.rgbaString
                });
              }
            });
          }
        })(i);
      }

      for (var i = 0; i < this.stroke.list.length; i++) {
        (function(k) {
          _$.addEvent(that.stroke.list[k], that.ev.click, function() {
            that.stroke.value = k * 2 + 2;
            that.stroke.icon.style.width = that.stroke.value + "px";
            that.mySignature.resetCanvas({
              lineWidth: that.stroke.value
            });
          });
        })(i);
      }

      _$.addEvent(popupScroll, "scroll", function() {
        mainScrollLeft = popupScroll.scrollLeft;
        mainScrollTop = popupScroll.scrollTop;
      });
    },
    setup: function(that) {
      _$.addClass("jSignature-popup-open", that.html);
      _$.removeClass("jSignature-popup-signature", that.popup);
      that.settings.onBefore && that.settings.onBefore();
      /**/
      html2canvas(that.element).then(function(canvas) {
        that.mySignature.reInit(canvas);
        that.settings.onStart && that.settings.onStart(that.mySignature);
      });
    },
    noScroll: function(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  _win.jSignature = jSignature;
})(window);
