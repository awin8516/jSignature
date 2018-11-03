/* jSignature
 * by F 
 * date 2017-06-25
 * version 1.0.0
 */
/**/
require('./css/jSignature.css');
window._$ = require('./fun.js');
import html2canvas from 'html2canvas';
const signature = require('./signature.js');
;(function(_win, undefined) {
  'use strict'
  /***************
   * by javascript
   **************/

  var defaults = {
    btnStart: 'btnStart',
    btnEnd: 'btnEnd',
    lineColor: '#000000',
    lineWidth: 2,
    background: '#FFFFFF',
    onBefore: null,
    onStart: null,
    onMove: null,
    onClose: null,
    onEnd: null
  }

  function jSignature(id, options) {
    // DOM elements/objects
    this.element = document.getElementById(id)
	this.settings = _$.extend(defaults, options)
	this.btnStart = []
	var selecterList = this.settings.btnStart.split(',')
	for(var i=0; i<selecterList.length;i++){
		this.btnStart.push(document.querySelector(selecterList[i]))
	}
    // this.btnEnd = document.getElementById(this.settings.btnEnd)
    this.init()
  }

  jSignature.prototype = {
    init: function() {
      var mySignature
      var that = this
      var html = document.getElementsByTagName('html')[0]
      
      var setup = function() {
		_$.addClass('noscroll', html)
		var popup = document.createElement('div')
		var popupMain = document.createElement('div')
		var popupMainMask = document.createElement('div')
		var popupControls = document.createElement('div')
        that.settings.onBefore && that.settings.onBefore()
        /**/
        html2canvas(that.element).then(function(canvas) {
          popup.className = 'jSignature-popup'
          popupMain.className = 'jSignature-popup-main'
          popupMainMask.className = 'jSignature-popup-main-mask'
          popupMainMask.style.height = canvas.style.height
          popupControls.className = 'jSignature-popup-controls'
          popupControls.innerHTML =
            '<a class="j-audio jSignature-popup-controls-signature"></a><a class="j-audio jSignature-popup-controls-clear"></a><a class="j-audio jSignature-popup-controls-cancel"></a><a class="j-audio jSignature-popup-controls-save"></a>'
          popupMain.firstChild && popupMain.removeChild(popupMain.firstChild)
          popupMain.appendChild(canvas)
          popupMain.appendChild(popupMainMask)
          popup.appendChild(popupMain)
          popup.appendChild(popupControls)
          document.body.appendChild(popup)
          
          mySignature = new signature(canvas, {
            lineColor: that.settings.lineColor,
            lineWidth: that.settings.lineWidth,
            background: that.settings.background,
            autoFit: true,
            onDraging: that.settings.onMove
          })
          that.settings.onStart && that.settings.onStart(mySignature)
          var btns = _$.children(popupControls)
          var mainScrollLeft = 0
          var mainScrollTop = 0
          var signatureIng = false
          var left = null
          var top = null
          _$.addEvent(btns[0], 'click', function() {
            _$.toggleClass('jSignature-popup-signature', popup)
            if (signatureIng) {
              popupMain.style.marginLeft = 0
              popupMain.style.marginTop = 0
              popupMain.scrollLeft = left
              popupMain.scrollTop = top
            } else {
              left = mainScrollLeft
              top = mainScrollTop
              popupMain.scrollLeft = 0
              popupMain.scrollTop = 0
              popupMain.style.marginLeft = -left + 'px'
              popupMain.style.marginTop = -top + 'px'
            }
            signatureIng = !signatureIng
          })
          _$.addEvent(btns[1], 'click', function() {
            mySignature.clearCanvas()
          })
          _$.addEvent(btns[2], 'click', function() {
            that.settings.onClose && that.settings.onClose()
			_$.remove(popup)
			popup = null
            _$.removeClass('noscroll', html)
          })
          _$.addEvent(btns[3], 'click', function() {
            that.settings.onEnd && that.settings.onEnd(mySignature.getDataURL())
			_$.remove(popup)
			popup = null
            _$.removeClass('noscroll', html)
          })

          _$.addEvent(popupMain, 'scroll', function() {
            mainScrollLeft = popupMain.scrollLeft
            mainScrollTop = popupMain.scrollTop
          })
        })
	  }
	  if(this.btnStart.length){
		for(var i=0; i<this.btnStart.length;i++){
			this.btnStart[i] && _$.addEvent(this.btnStart[i], 'click', setup)
		}
	  }

    //   this.btnEnd &&
    //     _$.addEvent(this.btnEnd, 'click', function() {
    //       that.settings.onEnd && that.settings.onEnd(mySignature.getDataURL())
    //       _$.remove(popup)
    //       _$.removeClass('noscroll', html)
    //     })
    }
  }

  _win.jSignature = jSignature
})(window)
