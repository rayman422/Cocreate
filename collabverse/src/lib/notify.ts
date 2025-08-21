import { prisma } from '@/server/prisma';

export async function createNotification(userId: string, type: string, payload?: unknown) {
	return prisma.notification.create({ data: { userId, type, payload: payload ? JSON.stringify(payload) : null } });
}

export async function notifyProjectMembers(projectId: string, type: string, payload?: unknown, excludeUserId?: string) {
	const members = await prisma.membership.findMany({ where: { projectId, status: 'ACTIVE' }, select: { userId: true } });
	const userIds = members.map((m) => m.userId).filter((id) => id !== excludeUserId);
	if (userIds.length === 0) return { count: 0 };
	return prisma.notification.createMany({ data: userIds.map((userId) => ({ userId, type, payload: payload ? JSON.stringify(payload) : null })) });
}