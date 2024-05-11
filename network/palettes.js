import axiosInstance from './axios.client';

export const getAllPalettes = async () => {
  return axiosInstance.get('color_palettes');
};

export const createPalette = async (palette) => {
  return axiosInstance.post(
    'color_palettes.json',
    JSON.stringify({
      color_palette: palette
    })
  );
};

export const deletePalette = async (paletteId) => {
  return axiosInstance.delete(`color_palettes/${paletteId}.json`);
};

export const patchPalette = async (paletteId, palette) => {
  return axiosInstance.put(
    `color_palettes/${paletteId}.json`,
    JSON.stringify({
      color_palette: palette
    })
  );
};

export const addNewColorToPalette = async (paletteId, color) => {
  return axiosInstance.post(
    `color_palettes/${paletteId}/colors.json`,
    JSON.stringify({
      color: color
    })
  );
};

export const deleteColorFromPalette = async (paletteId, colorId) => {
  return axiosInstance.delete(`color_palettes/${paletteId}/colors/${colorId}.json`);
};

export const getExplorePalettes = async (page = 1, query = '') => {
  return axiosInstance.get(`color_palettes/explore.json?page=${page}&query=${query}`);
};
