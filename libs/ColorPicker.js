import kmeans from 'ml-kmeans';
import Jimp from 'jimp';
import Color from 'pigment/full';
export default class ColorPicker {
  static getProminentColors(image) {
    console.log("image: " + image);
    /*
    Jimp.RESIZE_NEAREST_NEIGHBOR;
    Jimp.RESIZE_BILINEAR;
    Jimp.RESIZE_BICUBIC;
    Jimp.RESIZE_HERMITE;
    Jimp.RESIZE_BEZIER;
    These does not work with first params.
    */
    image.resize(Jimp.AUTO, 100);
    let data = ColorPicker._prepareDataForKmeans(image);
    let time = Date.now()
    let ans = kmeans(data, 24, { initialization: 'random', maxIterations: 20 });
    console.log(JSON.stringify(ans) + "," + (Date.now() - time) + " ms");
    ans.centroids = ans.centroids.sort((c1, c2) => c2.size - c1.size);
    console.log(ans.centroids);
    let kmeansColors  = ans.centroids.map(centroid => {return new Color(this._labToHex(centroid.centroid))});
    return this._getFinalColors(kmeansColors).map(c => {return {color: c.tohex()}});
  }
  // original implementation in java: https://github.com/kamalkishor1991/croma/blob/master/src/main/java/org/numixproject/colorextractor/image/KMeansColorPicker.java
  static _getFinalColors(kmeansColors) {
    console.log("----------------------", kmeansColors);
    kmeansColors.sort((c1, c2) => this._toArray(c1.tohsv())[0] < this._toArray(c2.tohsv())[0]);
    let filteredColors = [];
    for (let i = 0;i < kmeansColors.length; i += 4) {
      let colorList = [];
      for (let j = 0; j < 4; j++) {
        colorList.push(kmeansColors[i + j]);
      }
      colorList.sort((c1, c2) => this._toArray(c1.tohsv())[1] < this._toArray(c2.tohsv())[1]);
      filteredColors.push(colorList[colorList.length - 1]);
      filteredColors.push(colorList[colorList.length - 2]);
    }
    console.log("filtered colors:" + filteredColors);
    let finalColors = [];
    for (let i = 0;i < filteredColors.length; i += 2) {
      if (this._toArray(filteredColors[i].tohsv())[2] > this._toArray(filteredColors[i + 1].tohsv())[2]) {
        finalColors.push(filteredColors[i]);
      } else {
        finalColors.push(filteredColors[i + 1]);
      }
    }
    return finalColors;
  }

  static _labToHex(lab) {
    let color = new Color("lab(" + lab[0] + ", " + lab[1] + ", " + lab[2] +  ")");
    return color.tohex();
  }

  static _prepareDataForKmeans(image) {
    let data = [];
    
    console.log("image============", image.bitmap.width, image.bitmap.height);
    for (let i = 0; i < image.bitmap.width; i++) {
      for (let j = 0; j < image.bitmap.height; j++) {
        let intColor = image.getPixelColor(i, j);
        let hex = this._toHexColor(intColor);
        console.log("hex:", hex);
        let color = new Color(hex);
        let xyz = color.tolab();
        // format: "xyz(19.78527130484015, 8.600439447528947, 95.19796416837329)" to double array of xyz
        xyz = xyz.substr(4, xyz.length - 5).split(", ").map(v => parseFloat(v))
        data.push(xyz);
      } 
    }
    
    return data;
  }

  static _toHexColor(intColor) {
    let rgba = Jimp.intToRGBA(intColor); // TODO: Need to optimize this once everything else starts working.
    let color = new Color("rgb(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")");
    return color.tohex();
  }

  static _toArray(color) {
    let index = color.indexOf("(");
    color = color.substr(index + 1, color.length - index);
    return color.split(", ").map(c => parseFloat(c));
  }
}