/* jSignature
 * by F 
 * date 2017-06-25
 * version 1.0.0
 */
/**/
require('./css/jSignature.css')
import html2canvas from 'html2canvas'
window._$ = require('./js/fun.js')
const signature = require('./js/signature.js')
;(function(_win, undefined) {
  'use strict'
  /***************
   * by javascript
   **************/

  var defaults = {
    btnStart: '#btnStart',
    lineColor: '#000000',
    lineWidth: 4,
    background: '#FFFFFF',
    onBefore: null,
    onStart: null,
    onDraging: null,
    onClose: null,
    onEnd: null
  }

  function jSignature(id, options) {
    // DOM elements/objects
    this.html = document.getElementsByTagName('html')[0]
    this.element = document.getElementById(id)
    this.settings = _$.extend(defaults, options)
    this.btnStart = []
    var selecterList = this.settings.btnStart.split(',')
    for (var i = 0; i < selecterList.length; i++) {
      this.btnStart.push(document.querySelector(selecterList[i]))
    }
    this.isPc = !navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
    this.ev = {
      click: this.isPc ? 'click' : 'touchstart'
    }
    this.init()
  }

  jSignature.prototype = {
    init: function() {
      var that = this
      this.createPopup()
      if (this.btnStart.length) {
        for (var i = 0; i < this.btnStart.length; i++) {
          this.btnStart[i] &&
            _$.addEvent(this.btnStart[i], this.ev.click, function(){
              that.setup(that)
            })
        }
      }
    },
    createPopup: function() {
      this.popup = document.createElement('div')
      this.popup.className = 'jSignature-popup'
      this.popup.innerHTML =
          '<div class="jSignature-popup-scroll">\
            <div class="jSignature-popup-content">\
              <canvas></canvas>\
              <div class="jSignature-popup-mask"></div>\
            </div>\
          </div>\
          <div class="jSignature-popup-controls">\
            <a class="j-audio jSignature-popup-controls-signature"></a>\
            <a class="j-audio jSignature-popup-controls-stroke"><i style="width:'+this.settings.lineWidth +'px"></i><ul><li></li><li></li><li></li><li></li></ul></a>\
            <a class="j-audio jSignature-popup-controls-clear"></a>\
            <a class="j-audio jSignature-popup-controls-cancel"></a>\
            <a class="j-audio jSignature-popup-controls-save"></a>\
          </div>'

      // var popup = document.createElement('div')
      // var popupScroll = document.createElement('div')
      // var popupScrollMask = document.createElement('div')
      // var popupControls = document.createElement('div')
      // popup.className = 'jSignature-popup'
      // popupScroll.className = 'jSignature-popup-main'
      // popupScrollMask.className = 'jSignature-popup-main-mask'
      // popupControls.className = 'jSignature-popup-controls'
      // popupControls.innerHTML =
      //   '<a class="j-audio jSignature-popup-controls-signature"></a>\
      //     <a class="j-audio jSignature-popup-controls-stroke"><i style="width:' +
      //   this.settings.lineWidth +
      //   'px"></i><ul><li></li><li></li><li></li><li></li></ul></a>\
      //     <a class="j-audio jSignature-popup-controls-clear"></a>\
      //     <a class="j-audio jSignature-popup-controls-cancel"></a>\
      //     <a class="j-audio jSignature-popup-controls-save"></a>'
      // popupScroll.firstChild && popupScroll.removeChild(popupScroll.firstChild)

      // popupScroll.appendChild(popupScrollMask)
      // popup.appendChild(popupScroll)
      // popup.appendChild(popupControls)
      document.body.appendChild(this.popup)
      this.addEvent()
    },
    addEvent: function() {
      var popupScroll = _$.children(this.popup)[0]
      var popupContent = _$.children(popupScroll)[0]
      var popupCanvas = _$.children(popupContent)[0]
      var popupControls = _$.children(this.popup)[1]
      var btns = _$.children(popupControls)
      this.popupCanvas = popupCanvas
      
      this.mySignature = new signature(popupCanvas, {
        lineColor: this.settings.lineColor,
        lineWidth: this.settings.lineWidth,
        background: this.settings.background,
        autoFit: true,
        onDraging: this.settings.onDraging
      })

      var that = this
      var mainScrollLeft = 0
      var mainScrollTop = 0
      var signatureIng = false
      var left = null
      var top = null
      var fn = [
        // 签字笔
        function() {
          _$.toggleClass('jSignature-popup-signature', that.popup)
          if (signatureIng) {
            popupScroll.style.marginLeft = 0
            popupScroll.style.marginTop = 0
            popupScroll.scrollLeft = left
            popupScroll.scrollTop = top
            _$.removeEvent(document, 'mousemove touchmove', that.noScroll)
          } else {
            left = mainScrollLeft
            top = mainScrollTop
            popupScroll.scrollLeft = 0
            popupScroll.scrollTop = 0
            popupScroll.style.marginLeft = -left + 'px'
            popupScroll.style.marginTop = -top + 'px'
            _$.addEvent(document, 'mousemove touchmove', that.noScroll)
          }
          signatureIng = !signatureIng
        },

        // 清除
        function() {
          that.mySignature.clearCanvas()
        },

        // 画笔粗细
        function() {},

        // 关闭
        function() {
          mainScrollLeft = 0
          mainScrollTop = 0
          signatureIng = false
          left = null
          top = null
          popupScroll.style = ''
          that.settings.onClose && that.settings.onClose()
          _$.removeClass('jSignature-popup-open', that.html)
        },

        // 确认
        function() {
          mainScrollLeft = 0
          mainScrollTop = 0
          signatureIng = false
          left = null
          top = null
          popupScroll.style = ''
          that.settings.onEnd && that.settings.onEnd(that.mySignature.getDataURL())
          _$.removeClass('jSignature-popup-open', that.html)
        }
      ]
      
      for (var i = 0; i < btns.length; i++) {
        _$.addEvent(btns[i], this.ev.click, fn[i])
      }

      _$.addEvent(popupScroll, 'scroll', function() {
        mainScrollLeft = popupScroll.scrollLeft
        mainScrollTop = popupScroll.scrollTop
      })
    },
    setup: function(that) {
      _$.addClass('jSignature-popup-open', that.html)
      _$.removeClass('jSignature-popup-signature', that.popup)
      that.settings.onBefore && that.settings.onBefore()
      /**/
      // that.popupScroll.innerHTML = ''
      html2canvas(that.element).then(function(canvas) {
        that.popupCanvas.width = canvas.width
        that.popupCanvas.height = canvas.height
        that.popupCanvas.style.width = canvas.style.width
        that.popupCanvas.style.height = canvas.style.height
        console.log(canvas.width,canvas.height,canvas.style)        
        that.popupCanvas.getContext("2d").drawImage(canvas,0,0);
        that.mySignature._cloneCanvas(that.popupCanvas)
        // document.body.appendChild(canvas)
        // that.popupScroll.appendChild(canvas)
        // popupScrollMask.style.height = canvas.style.height
        
        that.settings.onStart && that.settings.onStart(that.mySignature)
      })
    },
    noScroll: function(e) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  _win.jSignature = jSignature
})(window)
