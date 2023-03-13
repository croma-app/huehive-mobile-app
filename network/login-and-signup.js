import axios, { isCancel, AxiosError } from "axios";

export const login = async (email, password) => {
  return axios.post(
    "https://api.croma.app/users/sign_in",
    {
      user: {
        email: email,
        password: password,
      },
    },
    {
      headers: {
        //   accept: "application/json",
        "content-type": "application/json",
      },
    }
  );
};

export const signUp = async (full_name, email, password) => {
  return axios.post(
    "https://api.croma.app/users/sign_up",
    {
      user: {
        full_name,
        email: email,
        password: password,
      },
    },
    {
      headers: {
        //   accept: "application/json",
        "content-type": "application/json",
      },
    }
  );
};
