import getAxiosClient from './axios.client';

// export const upsertAllPalettes = async (palettes) => {
//   const axiosClient = await getAxiosClient();
//   return axiosClient.post(
//     'color_palette/upsert_all',
//     JSON.stringify({
//       palettes: palettes
//     })
//   );
// };

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
