import {
  assignComplaintSchema,
  complaintQuerySchema,
  updateStatusSchema,
} from '@waterwatch/shared/schemas';
import { prisma } from '../utils/prisma.js';
import { ok } from '../utils/response.js';

export async function getAllComplaints(req, res, next) {
  try {
    const query = complaintQuerySchema.parse(req.query);
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.issueType ? { issueType: query.issueType } : {}),
      ...(query.severity ? { aiSeverity: query.severity } : {}),
      ...(query.search
        ? {
            OR: [
              { description: { contains: query.search, mode: 'insensitive' } },
              { address: { contains: query.search, mode: 'insensitive' } },
              { id: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.complaint.findMany({
        where,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.complaint.count({ where }),
    ]);

    return ok(res, items, { page: query.page, total });
  } catch (error) {
    return next(error);
  }
}

export async function updateComplaintStatus(req, res, next) {
  try {
    const input = updateStatusSchema.parse(req.body);
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        status: input.status,
        adminNotes: input.adminNotes,
        resolvedAt: input.status === 'RESOLVED' ? new Date() : null,
      },
    });

    return ok(res, complaint);
  } catch (error) {
    return next(error);
  }
}

export async function assignComplaint(req, res, next) {
  try {
    const input = assignComplaintSchema.parse(req.body);
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        assignedTo: input.assignedTo,
        aiPriority: input.priority,
        status: 'ASSIGNED',
      },
    });

    return ok(res, complaint);
  } catch (error) {
    return next(error);
  }
}

export async function getSummary(_req, res, next) {
  try {
    const [byType, bySeverity, totals] = await prisma.$transaction([
      prisma.complaint.groupBy({ by: ['issueType'], _count: { _all: true } }),
      prisma.complaint.groupBy({ by: ['aiSeverity'], _count: { _all: true } }),
      prisma.complaint.count(),
    ]);

    return ok(res, { totals, byType, bySeverity });
  } catch (error) {
    return next(error);
  }
}

export async function getTrends(_req, res, next) {
  try {
    const complaints = await prisma.complaint.findMany({
      select: { id: true, createdAt: true, status: true, issueType: true },
      orderBy: { createdAt: 'asc' },
    });

    return ok(res, complaints);
  } catch (error) {
    return next(error);
  }
}

export async function getResolutionTime(_req, res, next) {
  try {
    const resolved = await prisma.complaint.findMany({
      where: { status: 'RESOLVED', resolvedAt: { not: null } },
      select: { issueType: true, createdAt: true, resolvedAt: true },
    });

    return ok(res, resolved);
  } catch (error) {
    return next(error);
  }
}
