/* jSignature
 * by F 
 * date 2017-06-25
 * version 1.0.0
 */
/**/
require("./css/jSignature.css");
import html2canvas from "html2canvas";
window._$ = require("./js/fun.js");
const signature = require("./js/signature.js");
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
      this.createPopup();      
      if (this.btnStart.length) {
        for (var i = 0; i < this.btnStart.length; i++) {
          this.btnStart[i] &&
            _$.addEvent(this.btnStart[i], this.ev.click, this.setup);
        }
      }
    },
    createPopup: function() {
      var popup = document.createElement("div");
      var popupMain = document.createElement("div");
      var popupMainMask = document.createElement("div");
      var popupControls = document.createElement("div");
      popup.className = "jSignature-popup";
      popupMain.className = "jSignature-popup-main";
      popupMainMask.className = "jSignature-popup-main-mask";      
      popupControls.className = "jSignature-popup-controls";
      popupControls.innerHTML =
        '<a class="j-audio jSignature-popup-controls-signature"></a>\
          <a class="j-audio jSignature-popup-controls-stroke"><i style="width:' +
          this.settings.lineWidth +
        'px"></i><ul><li></li><li></li><li></li><li></li></ul></a>\
          <a class="j-audio jSignature-popup-controls-clear"></a>\
          <a class="j-audio jSignature-popup-controls-cancel"></a>\
          <a class="j-audio jSignature-popup-controls-save"></a>';
      popupMain.firstChild && popupMain.removeChild(popupMain.firstChild);

      popupMain.appendChild(popupMainMask);
      popup.appendChild(popupMain);
      popup.appendChild(popupControls);
      document.body.appendChild(popup);
      var btns = _$.children(popupControls);
      this.addEvent(popup, popupMain, btns);
    },
    addEvent: function(popup, popupMain, btns) {
      var that = this;
      var mainScrollLeft = 0;
      var mainScrollTop = 0;
      var signatureIng = false;
      var left = null;
      var top = null;
      var fn = [
        // 签字笔
        function() {
          _$.toggleClass("jSignature-popup-signature", popup);
          if (signatureIng) {
            popupMain.style.marginLeft = 0;
            popupMain.style.marginTop = 0;
            popupMain.scrollLeft = left;
            popupMain.scrollTop = top;
            _$.removeEvent(document, "mousemove touchmove", that.noScroll);
          } else {
            left = mainScrollLeft;
            top = mainScrollTop;
            popupMain.scrollLeft = 0;
            popupMain.scrollTop = 0;
            popupMain.style.marginLeft = -left + "px";
            popupMain.style.marginTop = -top + "px";
            _$.addEvent(document, "mousemove touchmove", that.noScroll);
          }
          signatureIng = !signatureIng;
        },
        // 清除
        function() {
          mySignature.clearCanvas();
        },
        // 画笔粗细
        function() {},
        // 关闭
        function() {
          that.settings.onClose && that.settings.onClose();
          for (var i = 0; i < btns.length; i++) {
            _$.removeEvent(btns[i], that.ev.click, fn[i]);
          }
          _$.remove(popup);
          popup = null;
          mySignature = null;
          _$.removeClass("noscroll", that.html);
        },
        // 确认
        function() {
          that.settings.onEnd && that.settings.onEnd(mySignature.getDataURL());
          _$.remove(popup);
          popup = null;
          mySignature = null;
          _$.removeClass("noscroll", that.html);
        }
      ];
      for (var i = 0; i < btns.length; i++) {
        _$.addEvent(btns[i], that.ev.click, fn[i]);
      }

      _$.addEvent(popupMain, "scroll", function() {
        mainScrollLeft = popupMain.scrollLeft;
        mainScrollTop = popupMain.scrollTop;
      });
    },
    setup: function() {
      var that = this;
      _$.addClass("noscroll", that.html);
      that.settings.onBefore && that.settings.onBefore();
      /**/
      that.popupMain.innerHTML = "";
      html2canvas(that.element).then(function(canvas) {
        that.popupMain.appendChild(canvas);
        popupMainMask.style.height = canvas.style.height;
        var mySignature = new signature(canvas, {
          lineColor: that.settings.lineColor,
          lineWidth: that.settings.lineWidth,
          background: that.settings.background,
          autoFit: true,
          onDraging: that.settings.onDraging
        });
        that.settings.onStart && that.settings.onStart(mySignature);
      });
    },
    noScroll: function(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  _win.jSignature = jSignature;
})(window);
