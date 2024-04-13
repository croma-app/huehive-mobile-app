import getAxiosClient from './axios.client';

export const generateAIColorSuggestions = async (query) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.get('colors/generate_suggestions?query=' + query);
};
