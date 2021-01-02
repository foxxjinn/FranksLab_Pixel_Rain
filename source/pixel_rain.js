// # Released under MIT License
// Copyright (c) 2020, Jinn Foxx
//
// Original author is Frank from Frank's Laboratory
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
// IN THE SOFTWARE.
//
// The main source of this code is from Frank's Laboratory
// https://www.youtube.com/watch?v=RCVxXgJ8xSk&ab_channel=Frankslaboratory
// with several modifications by Jinn Foxx

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
                  let particles = []
                  const numberOfParticles = 5000
      
                  for (let i = 0; i <= numberOfParticles; i++) {
                        particles.push(new Particle(canvas))    
                  }
      
                  // Getting pixel data then creating a matrix of the brightness of each pixel
                  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
                  let brightnessMatrix = []
                  for (let y = 0; y < canvas.height; y++) {
                        let row = []
                        for (let x = 0; x < canvas.width; x++) {
                              const red = pixels.data[(y * 4 * pixels.width) + (x * 4)]
                              const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
                              const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]
                              const cellBrightness = (caculateRelativeBrightness(red, green, blue))
                              row.push(cellBrightness)
                        }
                        brightnessMatrix.push(row)
                  }

                  /**
                   * The human eye sees the brightness of different colors differently. 
                   * This function is meant to return a more accurate brightness,
                   * but a simple ((red * blue * green) / 3) would suffice
                   * @param {numble} red 
                   * @param {number} green 
                   * @param {number} blue 
                   */
                  function caculateRelativeBrightness(red, green, blue) {
                        return Math.sqrt(
                              (red * red) * 0.299 +
                              (green * green) * 0.587 +
                              (blue * blue) * 0.114
                        )
                  }
    
                  function animate() {
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                        ctx.globalAlpha = 0.05
                        ctx.fillStyle = 'rgb(0, 0, 0)'
                        ctx.fillRect(0, 0, canvas.width, canvas.height)
                        for (let particle of particles) {
                              particle.step(ctx, canvas)
                        }
                        requestAnimationFrame(animate)
                  }
      
                  animate()
      
            }) // end of load listener      
    }

    // Private Variables
    class Particle {
          constructor(canvas) {
                this.x = Math.random() * canvas.width
                this.y = 0
                this.speed = 0
                this.velocity = Math.random() * 3.5
                this.size = Math.random() * 1.5 + 1
          }

          step(ctx, canvas) {
                this.update(canvas)
                this.draw(ctx)
          }

          update(canvas) {
                this.y += this.velocity
                if (this.y >= canvas.height) {
                      this.y = 0
                      this.x = Math.random() * canvas.width
                } 
          }

          draw(ctx) {
                ctx.beginPath()
                ctx.fillStyle = 'white'
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
          }
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