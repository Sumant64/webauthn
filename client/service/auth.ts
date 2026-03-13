import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

// sample commit

export const putRegisterRequest = (payload: any) => {
  config.headers['Content-Type'] = 'application/json';
  return axios.put(`http://localhost:5000/api/auth/init-register`, payload, config);
};

export const postVerifyRegisterRequest = (payload: any) => {
  config.headers['Content-Type'] = 'application/json';
  return axios.post(`http://localhost:5000/api/auth/verify-register`, payload, config);
};

export const getAuthRequest = (phone: any) => {
  config.headers['Content-Type'] = 'application/json';
  return axios.get(`http://localhost:5000/api/auth/init-auth?phone=${phone}`, config);
};


export const postVerifyAuthRequest = (payload: any) => {
  config.headers['Content-Type'] = 'application/json';
  return axios.post(`http://localhost:5000/api/auth/verify-auth`, payload, config);
};