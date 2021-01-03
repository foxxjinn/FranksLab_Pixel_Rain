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

      /**
       * Convert an image into an animation of raining particles!
       * It's important to note this will not work if the canvas is smaller than the image
       * @param {Canvas Element} canvas 
       * @param {Image} image preffered base64
       * @param {Number} particleSize will not accept 0 or negative
       * @param {Number} particleCount defaults to 5000
       * @param {Number} speed will not accept 0 or negative
       * @param {Number} brigthness defaults to 10
       */
    function pixelRain (canvas, image, particleSize = 1.5, particleCount = 5000, particleSpeed = 1.5, brightness = 10) {
            
            // Try Catches 
            let ctx
            if (typeof canvas.getContext == 'function') {
                  ctx = canvas.getContext('2d')
            } else {
                  throw new TypeError('pixelRain: first parameter must be HTML Canvas element')
            }
            if (!(image instanceof Image)) {
                  throw new TypeError('pixelRain: second parameter must be an Image')
            }
            if (
                  typeof particleSize !== 'number' || typeof particleCount !== 'number' || typeof particleSpeed !== 'number'
                  && typeof brightness !== 'number'      
            ){
                  throw new TypeError('pixelRain: the last four params must be numbers')
            } else {
                  // will not allow 0 or negative
                  if (particleSize === 0) particleSize = 1
                  particleSize = Math.abs(particleSize)

                  if (particleSpeed === 0) particleSpeed = 1.5
                  particleSpeed = Math.abs(particleSpeed)

                  brightness = Math.abs(brightness)

                  // will not allow negative or fraction
                  particleCount = Math.abs(Math.floor(particleCount))
            }


            image.addEventListener('load', ()=> {
                  let particles = []
                  const numberOfParticles = particleCount
      
                  for (let i = 0; i <= numberOfParticles; i++) {
                        particles.push(new Particle(canvas, particleSize, particleSpeed, brightness))    
                  }
      
                  // Getting pixel data then creating a matrix of the brightness of each pixel
                  ctx.drawImage(image, 0, 0, image.width, image.height)
                  let pixels = ctx.getImageData(0, 0, image.width, image.height)
                  let brightnessMatrix = []
                  for (let y = 0; y < image.height; y++) {
                        let row = []
                        for (let x = 0; x < image.width; x++) {
                              const red = pixels.data[(y * 4 * pixels.width) + (x * 4)]
                              const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
                              const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]
                              const cellBrightness = (caculateRelativeBrightness(red, green, blue))
                              row.push({r: red, g: green, b: blue, lum: cellBrightness})
                        }
                        brightnessMatrix.push(row)
                  }
                  ctx.clearRect(0, 0, canvas.width, canvas.height)

                  /**
                   * The human eye sees the brightness of different colors differently. 
                   * This function is meant to return a more accurate brightness,
                   * but a simple ((red * blue * green) / 3) would suffice
                   * @param {numble} red 
                   * @param {number} green 
                   * @param {number} blue 
                   */
                  function caculateRelativeBrightness(red, green, blue) {
                        return Math.floor(
                              Math.sqrt(
                                    (red * red) * 0.299 +
                                    (green * green) * 0.587 +
                                    (blue * blue) * 0.114
                              )
                        )/100
                  }
    
                  function animate() {
                        ctx.globalAlpha = 0.05
                        ctx.fillStyle = 'rgb(0, 0, 0)'
                        ctx.fillRect(0, 0, image.width, image.height)
                        for (let particle of particles) {
                              particle.step(ctx, image, brightnessMatrix)
                        }
                        requestAnimationFrame(animate)
                  }
      
                  animate()
      
            }) // end of load listener      
    }

    // Private Variables
    class Particle {
          constructor(canvas, size, velocity, brightness) {
                this.x = Math.random() * canvas.width
                this.y = 0
                this.speed = 0
                this.velocity = Math.random() * velocity
                this.size = Math.random() * size
                this.additiveBrigthness = brightness
          }

          step(ctx, image, matrix) {
                this.update(image, matrix)
                ctx.globalAlpha = this.speed * 0.2
                this.draw(ctx, matrix)
          }

          update(image, matrix) {

                if (matrix[Math.floor(this.y)][Math.floor(this.x)] !== undefined) {
                      this.speed = matrix[Math.floor(this.y)][Math.floor(this.x)].lum
                }

                // we want pixels to slow down the brighter the pixel
                let movement = (2.5 - this.speed) + this.velocity
                this.y += movement
                if (this.y >= image.height) {
                      this.y = 0
                      this.x = Math.random() * image.width
                } 
          }

          draw(ctx, matrix) {
                ctx.beginPath()
                let pixel
                if (matrix[Math.floor(this.y)][Math.floor(this.x)] !== undefined) {
                     pixel = matrix[Math.floor(this.y)][Math.floor(this.x)]
                } else {
                     pixel = {r: 0, g: 0, b: 0}
                }
                ctx.fillStyle = `rgb(${pixel.r + this.additiveBrigthness}, ${pixel.g + this.additiveBrigthness}, ${pixel.b + this.additiveBrigthness})`
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
          }
    }

    // Export pixelRain Function
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function() {
          return pixelRain;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = pixelRain;
            module.exports.pixelRain = pixelRain;
    } else {
        window.pixelRain = pixelRain;
    }
}());