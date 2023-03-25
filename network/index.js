import { login, signUp } from './login-and-signup';
import { getAllPalettes, createPalette } from './palettes';
const network = {
  login: login,
  signUp: signUp,
  getAllPalettes: getAllPalettes,
  createPalette: createPalette
};
export default network;
