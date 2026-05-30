import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';

export function useMapComplaints() {
  return useQuery({
    queryKey: ['map-complaints'],
    queryFn: async () => {
      const response = await api.get('/map/complaints');
      return response.data.data;
    }
  });
}

export function useMyComplaints() {
  return useQuery({
    queryKey: ['my-complaints'],
    queryFn: async () => {
      const response = await api.get('/complaints/mine');
      return response.data.data;
    }
  });
}
