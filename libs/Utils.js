import Jimp from 'jimp';
import Color from 'pigment/full';
export default class Utils {
  static toHexColor(intColor) {
    let rgba = Jimp.intToRGBA(intColor); // TODO: Need to optimize this once everything else starts working.
    let color = new Color("rgb(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")");
    return color.tohex();
  }
}