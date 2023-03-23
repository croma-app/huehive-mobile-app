export const upsert = async (palettes, userAuthInfo) => {
  return axios.post(
    'https://huehive.co/color_palette/upsert_all',
    JSON.stringify({
      palettes: palettes
    }),
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-User-Email': userAuthInfo.email,
        'X-User-Token': userAuthInfo.userToken
      }
    }
  );
};

export const getAll = async (userAuthInfo) => {
  return axios.get('https://huehive.co/color_palettes', {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': userAuthInfo.email,
      'X-User-Token': userAuthInfo.userToken
    }
  });
};
