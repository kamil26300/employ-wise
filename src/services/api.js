import axios from 'axios';

const API = axios.create({
  baseURL: 'https://reqres.in/api',
});

export const login = (email, password) => API.post('/login', { email, password });
export const fetchUsers = (page) => API.get(`/users?page=${page}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);