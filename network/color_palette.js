import axiosInstance from './axios.client';

export const generate = async (lockedColors, numColors) => {
  return axiosInstance.post('color_palettes/generate', {
    locked_colors: lockedColors,
    num_colors: numColors
  });
};

export const generateUsingColor = async (hexColor) => {
  return axiosInstance.post('color_palettes/generate_using_color', {
    base_color: hexColor
  });
};
