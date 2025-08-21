import { prisma } from '@/server/prisma';

export async function isProjectMember(userId: string, projectId: string) {
	const membership = await prisma.membership.findUnique({ where: { userId_projectId: { userId, projectId } } as any });
	return !!membership;
}

export async function isProjectOwner(userId: string, projectId: string) {
	const project = await prisma.project.findUnique({ where: { id: projectId } });
	return project?.ownerId === userId;
}