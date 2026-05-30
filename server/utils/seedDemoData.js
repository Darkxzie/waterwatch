import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';
import { logger } from './logger.js';

export async function seedDemoData() {
  try {
    const adminEmail = 'admin@waterwatch.local';
    const citizenEmail = 'citizen@waterwatch.local';
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    const [admin, citizen] = await Promise.all([
      prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
          email: adminEmail,
          name: 'WaterWatch Admin',
          password: passwordHash,
          role: 'ADMIN'
        }
      }),
      prisma.user.upsert({
        where: { email: citizenEmail },
        update: {},
        create: {
          email: citizenEmail,
          name: 'Demo Citizen',
          password: passwordHash,
          role: 'CITIZEN'
        }
      })
    ]);

    const existingComplaints = await prisma.complaint.count();
    if (existingComplaints === 0) {
      await prisma.complaint.createMany({
        data: [
          {
            userId: citizen.id,
            issueType: 'PIPE_LEAK',
            description: 'Continuous pipeline leakage near Madhapur junction affecting traffic and wasting water.',
            latitude: 17.4504,
            longitude: 78.3908,
            address: 'Madhapur',
            aiCategory: 'PIPE_LEAK',
            aiSeverity: 'HIGH',
            aiPriority: 'IMMEDIATE',
            aiSummary: 'High-volume pipeline leak reported near Madhapur junction.',
            aiConfidence: 0.84,
            aiSuggestedDept: 'HMWSSB',
            aiKeyFactors: ['continuous leakage', 'public road impact'],
            status: 'UNDER_REVIEW'
          },
          {
            userId: citizen.id,
            issueType: 'DIRTY_WATER',
            description: 'Brown water supply in residential taps since this morning in Kondapur.',
            latitude: 17.466,
            longitude: 78.3648,
            address: 'Kondapur',
            aiCategory: 'DIRTY_WATER',
            aiSeverity: 'HIGH',
            aiPriority: 'IMMEDIATE',
            aiSummary: 'Contaminated water supply affecting residential users in Kondapur.',
            aiConfidence: 0.88,
            aiSuggestedDept: 'Water Board',
            aiKeyFactors: ['water contamination', 'multiple households affected'],
            status: 'ASSIGNED',
            assignedTo: admin.id
          },
          {
            userId: citizen.id,
            issueType: 'NO_WATER_SUPPLY',
            description: 'No water supply in the apartment block for the last 12 hours.',
            latitude: 17.4319,
            longitude: 78.407,
            address: 'Jubilee Hills',
            aiCategory: 'NO_WATER_SUPPLY',
            aiSeverity: 'MEDIUM',
            aiPriority: 'MODERATE',
            aiSummary: 'Water outage reported by residents in Jubilee Hills apartment block.',
            aiConfidence: 0.76,
            aiSuggestedDept: 'HMWSSB',
            aiKeyFactors: ['supply disruption', 'apartment block complaint'],
            status: 'RESOLVED',
            resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 8)
          }
        ]
      });
    }

    logger.info({ message: 'Demo users and sample complaints ensured' });
  } catch (error) {
    logger.error({ message: 'Demo seed skipped', error: error.message });
  }
}
