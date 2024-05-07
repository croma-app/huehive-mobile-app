import getAxiosClient from './axios.client';

export const getAllPalettes = async () => {
  const axiosClient = await getAxiosClient();
  return axiosClient.get('color_palettes');
};

export const createPalette = async (palette) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.post(
    'color_palettes.json',
    JSON.stringify({
      color_palette: palette
    })
  );
};

export const deletePalette = async (paletteId) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.delete(`color_palettes/${paletteId}.json`);
};

export const patchPalette = async (paletteId, palette) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.put(
    `color_palettes/${paletteId}.json`,
    JSON.stringify({
      color_palette: palette
    })
  );
};

export const addNewColorToPalette = async (paletteId, color) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.post(
    `color_palettes/${paletteId}/colors.json`,
    JSON.stringify({
      color: color
    })
  );
};

export const deleteColorFromPalette = async (paletteId, colorId) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.delete(`color_palettes/${paletteId}/colors/${colorId}.json`);
};

export const getExplorePalettes = async (page = 1, query = '') => {
  const axiosClient = await getAxiosClient();
  return axiosClient.get(`color_palettes/explore.json?page=${page}&query=${query}`);
};
