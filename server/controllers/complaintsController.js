import { complaintQuerySchema, complaintSchema } from '@waterwatch/shared/schemas';
import { prisma } from '../utils/prisma.js';
import { created, ok } from '../utils/response.js';
import { analyzeComplaint } from '../services/aiAnalysis.js';
import { uploadImage } from '../services/storage.js';

export async function createComplaint(req, res, next) {
  try {
    const input = complaintSchema.parse(req.body);
    const photoUrl = await uploadImage(req.file);
    const ai = await analyzeComplaint({ ...input, imageBase64: photoUrl });
    const complaint = await prisma.complaint.create({
      data: {
        ...input,
        userId: req.user.sub,
        photoUrl,
        aiCategory: ai.category,
        aiSeverity: ai.severity,
        aiPriority: ai.priority,
        aiSummary: ai.summary,
        aiConfidence: ai.confidence,
        aiSuggestedDept: ai.suggestedDepartment,
        aiKeyFactors: ai.keyFactors || [],
        aiStatus: ai.aiStatus || 'COMPLETED'
      }
    });

    return created(res, complaint);
  } catch (error) {
    return next(error);
  }
}

export async function getMyComplaints(req, res, next) {
  try {
    const query = complaintQuerySchema.parse(req.query);
    const where = { userId: req.user.sub, ...(query.status ? { status: query.status } : {}) };
    const [items, total] = await prisma.$transaction([
      prisma.complaint.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      prisma.complaint.count({ where })
    ]);

    return ok(res, items, { page: query.page, total });
  } catch (error) {
    return next(error);
  }
}

export async function getComplaintById(req, res, next) {
  try {
    const complaint = await prisma.complaint.findFirst({
      where: { id: req.params.id, userId: req.user.sub }
    });

    return ok(res, complaint);
  } catch (error) {
    return next(error);
  }
}

export async function upvoteComplaint(req, res, next) {
  try {
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { upvotes: { increment: 1 } }
    });

    return ok(res, complaint);
  } catch (error) {
    return next(error);
  }
}

export async function getPublicMapComplaints(_req, res, next) {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { status: { not: 'REJECTED' } },
      select: {
        id: true,
        issueType: true,
        latitude: true,
        longitude: true,
        address: true,
        aiSeverity: true,
        status: true,
        createdAt: true,
        upvotes: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return ok(res, complaints);
  } catch (error) {
    return next(error);
  }
}

export async function getHeatmap(_req, res, next) {
  try {
    const rows = await prisma.complaint.groupBy({
      by: ['address'],
      _count: { _all: true },
      where: { status: { not: 'REJECTED' } }
    });

    return ok(res, rows);
  } catch (error) {
    return next(error);
  }
}
