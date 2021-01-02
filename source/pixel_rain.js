// Original Artist - Frank from Franks Laboratory
// https://www.youtube.com/watch?v=RCVxXgJ8xSk&ab_channel=Frankslaboratory

;(function(){

    function pixelRain (cavnas, image, colorDelay = 3) {

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