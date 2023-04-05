import getAxiosClient from './axios.client';

export const login = async (email, password) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.post(
    'users/sign_in',
    JSON.stringify({
      user: {
        email: email,
        password: password
      }
    })
  );
};

export const signUp = async (full_name, email, password) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.post('users', {
    user: {
      full_name,
      email: email,
      password: password
    }
  });
};

export const googleLogin = async (userInfo) => {
  const axiosClient = await getAxiosClient();
  return axiosClient.post('users/google_login', userInfo);
};
