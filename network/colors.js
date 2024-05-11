import axiosInstance from './axios.client';

export const generateAIColorSuggestions = async (query) => {
  return axiosInstance.get('colors/generate_suggestions?query=' + query);
};
