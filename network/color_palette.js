import axiosInstance from './axios.client';

export const generate = async (lockedColors, numColors) => {
  return axiosInstance.post('color_palettes/generate', {
    locked_colors: lockedColors,
    num_colors: numColors
  });
};
