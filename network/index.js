import { login, signUp } from './login-and-signup';
import { getAllPalettes, createPalette, deletePalette } from './palettes';
const network = {
  login: login,
  signUp: signUp,
  getAllPalettes: getAllPalettes,
  createPalette: createPalette,
  deletePalette: deletePalette
};
export default network;
