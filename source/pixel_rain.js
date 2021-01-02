// Jinn Foxx - 2020
// Original Artist - Frank from Franks Laboratory
// https://www.youtube.com/watch?v=RCVxXgJ8xSk&ab_channel=Frankslaboratory

;(function(){

    function pixelRain (canvas, image, colorDelay = 3) {
            
            // Try Catches 
            let ctx
            if (canvas.getContext('2d') !== null) {
                  ctx = canvas.getContext('2d')
            } else {
                  throw new TypeError('pixelRain: first parameter must be HTML Canvas element')
            }
            if (!(image instanceof Image)) {
                  throw new TypeError('pixelRain: second parameter must be an Image')
            }
            if (typeof colorDelay !== 'number') {
                  throw new TypeError('pixelRain: third parameter is to be a Number')
            }

            image.addEventListener('load', ()=> {
                  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            })
    
    }

    function animate() {
 
    }

    function lerp(initial, final, factor) {
        return initial + (final - initial) * factor
    }

    // Export pixelRain Function
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

        // AMD. Register as an anonymous module.
        define(function() {
          return pixelRain;
        });
      } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = pixelRain;
            module.exports.spinnyButton = pixelRain;
      } else {
            window.pixelRain = pixelRain;
      }
}());