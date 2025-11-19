import http from './http';

export const fetchCategoriesApi = () => http.get('/categories');
export const fetchProductsApi = (params) => http.get('/products', { params });
