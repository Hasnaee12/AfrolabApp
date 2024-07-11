// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.106:5000',
  //baseURL: 'http://192.168.0.126:5000',
});

// Task Definitions
export const fetchTaskDefinitions = () => api.get('/task_definitions');
export const createTaskDefinition = (data) => api.post('/task_definitions', data);
export const deleteTaskDefinition = (id) => api.delete(`/task_definitions/${id}`);

// Equipment CRUD operations
export const fetchEquipment = () => api.get('/equipment');
export const createEquipment = (data) => api.post('/equipment', data);
export const deleteEquipment = (id) => api.delete(`/equipment/${id}`);

// Collaborators CRUD operations
export const fetchCollaborators = (role) => api.get(`/collaborators?role=${role}`);
export const createCollaborator = (data) => api.post('/collaborators', data);
export const updateCollaborator = (id, data) => api.put(`/collaborators/${id}`, data);
export const deleteCollaborator = (id) => api.delete(`/collaborators/${id}`);

export default api;
