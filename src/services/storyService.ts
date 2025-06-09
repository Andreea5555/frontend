import axios from 'axios';
import { Story } from '../types/Story';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const storyService = {
  getAllStories: () => api.get<Story[]>('/stories'),
  getStoriesByDepartment: (department: string) => 
    api.get<Story[]>(`/stories/department/${department}`),
  createStory: (story: Omit<Story, 'id'>) => api.post<Story>('/stories', story),
  deleteStory: (id: string) => api.delete(`/stories/${id}`),
};