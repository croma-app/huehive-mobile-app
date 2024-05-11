import axiosInstance from './axios.client';

export const login = async (email, password) => {
  console.log({ email, password });
  return axiosInstance.post(
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
  return axiosInstance.post('users', {
    user: {
      full_name,
      email: email,
      password: password
    }
  });
};

export const googleLogin = async (userInfo) => {
  return axiosInstance.post('users/google_login', userInfo);
};

export const logout = async () => {
  return axiosInstance.delete('users/sign_out');
};
