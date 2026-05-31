import { prisma } from '../../utils/prisma.js';

const originalPrisma = {
  user: prisma.user,
  complaint: prisma.complaint,
  $transaction: prisma.$transaction
};

export function resetPrismaMocks() {
  prisma.user = originalPrisma.user;
  prisma.complaint = originalPrisma.complaint;
  prisma.$transaction = originalPrisma.$transaction;
}

export function mockPrisma({ user = {}, complaint = {}, transaction } = {}) {
  prisma.user = {
    findUnique: async () => null,
    create: async ({ data }) => ({ id: 'user-1', ...data }),
    ...user
  };

  prisma.complaint = {
    findMany: async () => [],
    findFirst: async () => null,
    create: async ({ data }) => ({ id: 'complaint-1', ...data }),
    update: async ({ where, data }) => ({ id: where.id, ...data }),
    count: async () => 0,
    groupBy: async () => [],
    ...complaint
  };

  prisma.$transaction = transaction || (async (operations) => Promise.all(operations));
}
