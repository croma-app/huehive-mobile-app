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
    //let kmeansColors  = ans.centroids.map(centroid => {return new Color(this._labToHex(centroid.centroid))});
    //kmeansColors.sort((c1, c2) => parseFloat(c1.tohsv().substr(4).split(", ")) < parseFloat(c2.tohsv().substr(4).split(", ")));
    return ans.centroids.map(centroid => {return {color: this._labToHex(centroid.centroid)}});
  }

  static _labToHex(xyz) {
    let color = new Color("lab(" + xyz[0] + ", " + xyz[1] + ", " + xyz[2] +  ")");
    console.log("color===========" + color.tohex());
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
}