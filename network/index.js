import { login, signUp } from './login-and-signup';
import {
  getAllPalettes,
  createPalette,
  deletePalette,
  patchPalette,
  addNewColorToPalette,
  deleteColorFromPalette
} from './palettes';
const network = {
  login: login,
  signUp: signUp,
  getAllPalettes: getAllPalettes,
  createPalette: createPalette,
  deletePalette: deletePalette,
  patchPalette: patchPalette,
  addNewColorToPalette: addNewColorToPalette,
  deleteColorFromPalette: deleteColorFromPalette
};
export default network;
