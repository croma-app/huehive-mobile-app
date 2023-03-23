import axiosClient from './axios.client';

export const upsertAllPalettes = async (palettes) => {
  return axiosClient.post(
    'color_palette/upsert_all',
    JSON.stringify({
      palettes: palettes
    })
  );
};

export const getAllPalettes = async () => {
  return axiosClient.get('color_palettes');
};
