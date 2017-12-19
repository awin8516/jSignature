/* jSignature
 * by F 
 * date 2017-06-25
 * version 1.0.0
 */
/**/
require('./css/jSignature.css');
window._$ = require('./fun.js');
const html2canvas = require('./html2canvas.js');
const signature = require('./signature.js');
(function(_win, undefined){
	'use strict';
	/***************
	 * by javascript
	 **************/	
	var defaults = {
		btnStart: 'btnStart',
		btnEnd : 'btnEnd',
		lineColor : '#000000',
		lineWidth : 2,
		background : '#FFFFFF',
		onBefore : null,
		onStart : null,
		onMove : null,
		onClose : null,
		onEnd : null
	};

	function jSignature(id, options) {
		// DOM elements/objects
		this.element = document.getElementById(id);
		this.settings = _$.extend(defaults, options);
		this.btnStart = document.getElementById(this.settings.btnStart);
		this.btnEnd = document.getElementById(this.settings.btnEnd);
		this.init();
	};
	
	jSignature.prototype = {
		init : function(){
			var mySignature;
			var that = this;
			var html = document.getElementsByTagName('html')[0];
			var popup = document.createElement('div');
			var popupMain = document.createElement('div');
			var popupMainMask = document.createElement('div');
			var popupControls = document.createElement('div');
			this.btnStart && _$.addEvent(this.btnStart, 'click', function(){
				that.settings.onBefore && that.settings.onBefore();
				/**/
				html2canvas(that.element).then(function(canvas) {
						popup.className = "jSignature-popup";
						popupMain.className = 'jSignature-popup-main';
						popupMainMask.className = 'jSignature-popup-main-mask';
						popupMainMask.style.height = canvas.height+'px';
						popupControls.className = 'jSignature-popup-controls';
						popupControls.innerHTML = '<a class="j-audio jSignature-popup-controls-move"></a><a class="j-audio jSignature-popup-controls-clear"></a><a class="j-audio jSignature-popup-controls-cancel"></a><a class="j-audio jSignature-popup-controls-save"></a>';
						popupMain.firstChild && popupMain.removeChild( popupMain.firstChild );  
						popupMain.appendChild(canvas);
						popupMain.appendChild(popupMainMask);
						popup.appendChild(popupMain);
						popup.appendChild(popupControls);
						document.body.appendChild(popup);
						_$.addClass('noscroll', html);
						mySignature = new signature(canvas, {
							lineColor: that.settings.lineColor,
							lineWidth: that.settings.lineWidth,
							background: that.settings.background,
							autoFit: false,
							onDraging : that.settings.onMove
						});
						that.settings.onStart && that.settings.onStart(mySignature);
						var btns = _$.children(popupControls);
						_$.addEvent(btns[0], 'click', function(){
							_$.toggleClass('jSignature-popup-move', popup);
						});
						_$.addEvent(btns[1], 'click', function(){
							mySignature.clearCanvas();
						});
						_$.addEvent(btns[2], 'click', function(){
							that.settings.onClose && that.settings.onClose();
							_$.remove(popup);
							_$.removeClass('noscroll', html);
						});
						_$.addEvent(btns[3], 'click', function(){
							that.settings.onEnd && that.settings.onEnd(mySignature.getDataURL());
							_$.remove(popup);
							_$.removeClass('noscroll', html);
						});
					
				});
			});

			this.btnEnd && _$.addEvent(this.btnEnd, 'click', function(){
				that.settings.onEnd && that.settings.onEnd(mySignature.getDataURL());
				_$.remove(popup);
				_$.removeClass('noscroll', html);
			});
		}
	};
	
	_win.jSignature = jSignature;
	
})(window);
