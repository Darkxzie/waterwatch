import { z } from 'zod';

export const issueTypes = ['PIPE_LEAK', 'NO_WATER_SUPPLY', 'DIRTY_WATER', 'WATER_WASTAGE', 'OTHER'];
export const severityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
export const priorityLevels = ['ROUTINE', 'MODERATE', 'IMMEDIATE', 'EMERGENCY'];
export const statusFlow = [
  'PENDING',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'REJECTED',
];
export const roles = ['CITIZEN', 'AUTHORITY', 'ADMIN'];

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const complaintSchema = z.object({
  issueType: z.enum(issueTypes),
  description: z.string().trim().min(20).max(1500),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().trim().max(240).optional().or(z.literal('')),
});

export const complaintQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(statusFlow).optional(),
  issueType: z.enum(issueTypes).optional(),
  severity: z.enum(severityLevels).optional(),
  search: z.string().trim().max(120).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(statusFlow),
  adminNotes: z.string().trim().max(1000).optional(),
});

export const assignComplaintSchema = z.object({
  assignedTo: z.string().uuid(),
  priority: z.enum(priorityLevels).optional(),
});

export const mapFilterSchema = z.object({
  issueType: z.enum(issueTypes).optional(),
  severity: z.enum(severityLevels).optional(),
  status: z.enum(statusFlow).optional(),
});
