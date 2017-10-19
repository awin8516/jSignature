/* signature
 * by F 
 * date 2017-06-25
 * version 1.0.0
 */
/**/
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);//定义每秒执行60次动画
			};
})();
window.cancelAnimationFrame = window.cancelAnimationFrame
		|| window.webkitCancelAnimationFrame
		|| window.webkitCancelRequestAnimationFrame
		|| window.mozCancelRequestAnimationFrame
		|| window.oCancelRequestAnimationFrame
		|| window.msCancelRequestAnimationFrame
		|| clearTimeout;


	'use strict';
	/***************
	 * by javascript
	 **************/	
	var defaults = {
		lineColor: '#222222',
		lineWidth: 1,
		background: '#FFFFFF',
		autoFit: false,
		onDraging : null
	};

	var signature = function(element, options) {
		// DOM elements/objects
		this.element = element;
		this.canvas = false;
		this.canvasbak = false;
		this.ctx = false;
		// Drawing state
		this.drawing = false;
		this.currentPos = {x: 0,y: 0};
		this.lastPos = this.currentPos;
		// Determine plugin settings
		//this._data = this.$element.data();
		this.settings = _$.extend(defaults, options);
		// Initialize the plugin
		this.init();
	};
	
	signature.prototype = {
		// Initialize the signature canvas
		init: function() {
			// Set up the canvas
			if(this.element.nodeName.toLowerCase() === 'canvas'){
				this.canvas = this.element
			}else{
				this.canvas = document.createElement('canvas');
				this.element.appendChild(this.canvas);
			};
			// Fit canvas to width of parent
			if (this.settings.autoFit === true) {
				this._resizeCanvas();
				// TO-DO - allow for dynamic canvas resizing 
				// (need to save canvas state before changing width to avoid getting cleared)
				// var timeout = false;
				// $(window).on('resize', $.proxy(function(e) {
				//   clearTimeout(timeout);
				//   timeout = setTimeout($.proxy(this._resizeCanvas, this), 250);
				// }, this));
			};
			_$.addClass('signature-initialized', this.canvas);
			this.canvas.style.cursor = 'default';
			this._cloneCanvas();
			this._resetCanvas();
			var that = this;
			// Set up mouse events
			_$.addEvent(this.canvas, 'mousedown touchstart', function(e){
				that.drawing = true;
				that.lastPos = that.currentPos = that._getPosition(e);
				that._drawLoop();
				_$.addEvent(that.canvas, 'mousemove touchmove', function(e){
					that.currentPos = that._getPosition(e);
					that.drawing && that.settings.onDraging && that.settings.onDraging(that);
				});
				_$.addEvent(that.canvas, 'mouseup touchend', function(e){
					that.drawing = false;
					cancelAnimationFrame(that.animFrame);
				});
				_$.addEvent(that.canvas, 'mouseleave', function(e){
					that.drawing = false;
					cancelAnimationFrame(that.animFrame);
				});
			});
			// Prevent document scrolling when touching canvas
			_$.addEvent(document, 'touchstart touchmove touchend', function(e){
				if (e.target === that.canvas) {
					e.preventDefault();
				};
			});
		},
		// Clear the canvas
		clearCanvas: function() {
			this.canvas.width = this.canvas.width;
			this._resetCanvas();
		},
		// Get the content of the canvas as a base64 data URL
		getDataURL: function(type, encoderOptions) {
			type = type || 'image/jpeg';
			encoderOptions = encoderOptions || 1.0;
			return this.canvas.toDataURL(type, encoderOptions);
		},
		//
		_drawLoop: function() {
			// Start drawing
			var that = this;
			(function drawLoop (){
				that.animFrame = requestAnimFrame(drawLoop);
				that._renderCanvas();
			})();
		},
		// Get the position of the mouse/touch
		_getPosition: function(event) {
			var xPos, yPos, rect;
			rect = this.canvas.getBoundingClientRect();
			event = event.originalEvent || event;
			// Touch event
			if (event.type.indexOf('touch') !== -1) { // event.constructor === TouchEvent
				xPos = event.touches[0].clientX - rect.left;
				yPos = event.touches[0].clientY - rect.top;
			}
			// Mouse event
			else {
				xPos = event.clientX - rect.left;
				yPos = event.clientY - rect.top;
			}
			return {
				x: xPos,
				y: yPos
			};	
		},
		// cloneCanvas
		_cloneCanvas: function() {
			this.canvasbak = _$.clone(this.canvas);
			this.ctxbak = this.canvasbak.getContext("2d");
			this.ctxbak.drawImage(this.canvas,0,0);
		},
		// Render the signature to the canvas
		_renderCanvas: function() {
			if (this.drawing) {
				this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
				this.ctx.lineTo(this.currentPos.x, this.currentPos.y);
				this.ctx.stroke();
				this.lastPos = this.currentPos;
			}
		},
		// Reset the canvas context
		_resetCanvas: function() {
			this.ctx = this.canvas.getContext("2d");
			this.ctx.drawImage(this.canvasbak,0,0);
			this.ctx.lineCap="round";
			this.ctx.strokeStyle = this.settings.lineColor;
			this.ctx.lineWidth = this.settings.lineWidth;
		},
		// Resize the canvas element
		_resizeCanvas: function() {
			this.canvas.width = this.element.clientWidth;
			this.canvas.height = this.element.clientHeight;
			this.canvas.style.width = this.element.clientWidth + 'px';
			this.canvas.style.height = this.element.clientHeight + 'px';
		},
		// _scale the canvas element
		_scale: function() {
			console.log(0);
			this.ctx.scale(1.5,1.5);
		}
	};

module.exports = signature; 