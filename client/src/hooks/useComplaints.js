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
      return response.data.data || [];
    }
  });
}

export function useAdminComplaints() {
  return useQuery({
    queryKey: ['admin-complaints'],
    queryFn: async () => {
      const response = await api.get('/admin/complaints');
      return response.data.data || [];
    }
  });
}

export function useAdminSummary() {
  return useQuery({
    queryKey: ['admin-summary'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics/summary');
      return response.data.data;
    }
  });
}

export function useAdminTrends() {
  return useQuery({
    queryKey: ['admin-trends'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics/trends');
      return response.data.data;
    }
  });
}

export function useAdminResolutionTime() {
  return useQuery({
    queryKey: ['admin-resolution-time'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics/resolution-time');
      return response.data.data;
    }
  });
}
