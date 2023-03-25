import getAxiosClient from './axios.client';

export const upsertAllPalettes = async (palettes) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.post(
    'color_palette/upsert_all',
    JSON.stringify({
      palettes: palettes
    })
  );
};

export const getAllPalettes = async () => {
  const axiosClient = await getAxiosClient();
  return axiosClient.get('color_palettes');
};
