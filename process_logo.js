const { Jimp } = require('jimp');

async function main() {
  try {
    const image = await Jimp.read('public/upneda.png');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      var red = this.bitmap.data[idx + 0];
      var green = this.bitmap.data[idx + 1];
      var blue = this.bitmap.data[idx + 2];
      var alpha = this.bitmap.data[idx + 3];

      // If it's close to white (background) or already transparent
      if (alpha < 10 || (red > 200 && green > 200 && blue > 200)) {
        this.bitmap.data[idx + 3] = 0; // Fully transparent
      } else {
        // Make the logo part completely white
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
        this.bitmap.data[idx + 3] = 255; // Fully opaque white
      }
    });

    await image.write('public/upneda-white.png');
    console.log("Logo processed successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
