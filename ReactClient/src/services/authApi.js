import http from './http';

export const registerApi = (payload) => http.post('/register', payload);
export const loginApi = (payload) => http.post('/login', payload);
export const forgotPasswordApi = (payload) => http.post('/forgot-password', payload);
export const resetPasswordApi = (payload) => http.post('/reset-password', payload);
export const getAccountApi = () => http.get('/account');
