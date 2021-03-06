/* signature
 * by F 
 * date 2017-06-25
 * version 1.0.0
 */
/**/
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60) //定义每秒执行60次动画
    }
  )
})()
window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  clearTimeout
;('use strict')
/***************
 * by javascript
 **************/



var signature = function(element, options) {
  this.defaults = {
    lineColor: '#222222',
    lineWidth: 1,
    background: '#FFFFFF',
    autoFit: false,
    onDraging: null
  }
  // DOM elements/objects
  this.element = element
  this.canvas = false
  this.canvasbak = document.createElement('canvas')
  this.ctx = false
  // Drawing state
  this.drawing = false
  this.currentPos = { x: 0, y: 0 }
  this.lastPos = this.currentPos
  // Determine plugin settings
  //this._data = this.$element.data();
  this.useAnimFrame = true
  this.settings = _$.extend(this.defaults, options)
  // Initialize the plugin
  this.init()
}

signature.prototype = {
  // Initialize the signature canvas
  init: function() {
    // Set up the canvas
    if (this.element.nodeName.toLowerCase() === 'canvas') {
      this.canvas = this.element
    } else {
      this.canvas = document.createElement('canvas')
      this.element.appendChild(this.canvas)
    }
    // Fit canvas to width of parent
    if (this.settings.autoFit === true) {
      // this.resizeCanvas();
      // TO-DO - allow for dynamic canvas resizing
      // (need to save canvas state before changing width to avoid getting cleared)
      // var timeout = false;
      // $(window).on('resize', $.proxy(function(e) {
      //   clearTimeout(timeout);
      //   timeout = setTimeout($.proxy(this.resizeCanvas, this), 250);
      // }, this));
    }
    _$.addClass('signature-initialized', this.canvas)
    this.canvas.style.cursor = 'default'
    this.backupCanvas()
    this.setCanvas()
    this.clientRect = this.canvas.getBoundingClientRect()
    var that = this
    // Set up mouse events
    _$.addEvent(this.canvas, 'mousedown touchstart', function(e) {
      that.drawing = true
      that.marginLeft = parseInt(that.canvas.parentNode.parentNode.style.marginLeft)
      that.marginTop = parseInt(that.canvas.parentNode.parentNode.style.marginTop)
      that.scalex = parseInt(
        that.canvas.width / parseInt(that.canvas.style.width)
      )
      that.ctx.beginPath()
      that.lastPos = that.currentPos = that.getPosition(e)
      this.useAnimFrame && that.drawLoop()
    })
    _$.addEvent(that.canvas, 'mousemove touchmove', function(e) {
      if (that.drawing) {
        that.currentPos = that.getPosition(e)
        !this.useAnimFrame && that.renderCanvas()
        that.settings.onDraging && that.settings.onDraging(that)
      }
    })
    _$.addEvent(that.canvas, 'mouseup touchend', function(e) {
      that.drawing = false
      cancelAnimationFrame(that.animFrame)
      that.animFrame = null
      that.ctx.closePath()
    })
    _$.addEvent(that.canvas, 'mouseleave', function(e) {
      that.drawing = false
      cancelAnimationFrame(that.animFrame)
      that.animFrame = null
      that.ctx.closePath()
    })
  },
  reInit : function(canvas){
    this.canvas.width = canvas.width
    this.canvas.height = canvas.height
    this.canvas.style.width = canvas.style.width
    this.canvas.style.height = canvas.style.height
    this.backupCanvas(canvas)
    this.setCanvas(canvas)
    this.clientRect = this.canvas.getBoundingClientRect()
  },
  // clear the canvas
  clearCanvas: function() {
    var ctx = this.canvas.getContext('2d')
    this.canvas.height=this.canvas.height; 
  },
  // backto the canvas
  backtoCanvas: function() {
    this.canvas.width = this.canvas.width    
    this.setCanvas()
  },
  // Get the content of the canvas as a base64 data URL
  getDataURL: function(type, encoderOptions) {
    type = type || 'image/jpeg'
    encoderOptions = encoderOptions || 1.0
    return this.canvas.toDataURL(type, encoderOptions)
  },
  //
  drawLoop: function() {
    // Start drawing
    var that = this
    ;(function drawLoop() {
      that.animFrame = requestAnimFrame(drawLoop)
      that.renderCanvas()
    })()
  },
  // Get the position of the mouse/touch
  getPosition: function(event) {
    var xPos, yPos
    event = event.originalEvent || event
    // Touch event
    if (event.type.indexOf('touch') !== -1) {
      // event.constructor === TouchEvent
      xPos = event.touches[0].clientX - this.clientRect.left - this.marginLeft
      yPos = event.touches[0].clientY - this.clientRect.top - this.marginTop
    }
    // Mouse event
    else {
      xPos = event.clientX - this.clientRect.left - this.marginLeft
      yPos = event.clientY - this.clientRect.top - this.marginTop
    }

    return {
      x: xPos * this.scalex,
      y: yPos * this.scalex
    }
  },
  
  // Render the signature to the canvas
  renderCanvas: function() {
    if (this.drawing) {
      this.ctx.moveTo(this.lastPos.x, this.lastPos.y)
      this.ctx.lineTo(this.currentPos.x, this.currentPos.y)
      this.ctx.stroke()
      this.lastPos = this.currentPos
    }
  },// backupCanvas
  backupCanvas: function(canvas) {
    canvas = canvas || this.canvas
    this.canvasbak.width = canvas.width
    this.canvasbak.height = canvas.height
    this.canvasbak.style.width = canvas.style.width
    this.canvasbak.style.height = canvas.style.height
    var ctx = this.canvasbak.getContext('2d')
    ctx.drawImage(canvas, 0, 0)
  },
  // Reset the canvas context
  setCanvas: function() {
    this.ctx = this.canvas.getContext('2d')
    this.ctx.drawImage(this.canvasbak, 0, 0)
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    // this.ctx.shadowBlur = 1
    // this.ctx.shadowColor = this.settings.lineColor
    this.ctx.strokeStyle = this.settings.lineColor
    this.ctx.lineWidth = this.settings.lineWidth
  },
  resetCanvas:function(o){
    this.settings = _$.extend(this.settings, o)
    this.ctx.shadowBlur = this.settings.shadowBlur
    this.ctx.shadowColor = this.settings.shadowColor
    this.ctx.strokeStyle = this.settings.lineColor
    this.ctx.lineWidth = this.settings.lineWidth
  },
  // Resize the canvas element
  resizeCanvas: function() {
    this.canvas.width = this.element.clientWidth
    this.canvas.height = this.element.clientHeight
    this.canvas.style.width = this.element.clientWidth + 'px'
    this.canvas.style.height = this.element.clientHeight + 'px'
  }
}

module.exports = signature
