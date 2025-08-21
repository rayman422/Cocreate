import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { z } from 'zod';
import { isProjectMember, isProjectOwner } from '@/lib/authz';
import { notifyProjectMembers } from '@/lib/notify';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
	const project = await prisma.project.findUnique({ where: { slug: params.slug } });
	if (!project) return new NextResponse('Not found', { status: 404 });
	const messages = await prisma.chatMessage.findMany({
		where: { projectId: project.id },
		orderBy: { createdAt: 'desc' },
		take: 50,
		include: { user: true }
	});
	return NextResponse.json(messages.reverse());
}

const SendSchema = z.object({ content: z.string().min(1).max(2000) });
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
	const project = await prisma.project.findUnique({ where: { slug: params.slug } });
	if (!project) return new NextResponse('Not found', { status: 404 });
	const isMember = await isProjectMember(session.user.id, project.id);
	const isOwner = await isProjectOwner(session.user.id, project.id);
	if (!isMember && !isOwner) return new NextResponse('Forbidden', { status: 403 });
	const json = await req.json();
	const parsed = SendSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	const msg = await prisma.chatMessage.create({ data: { projectId: project.id, userId: session.user.id, content: parsed.data.content } });
	await notifyProjectMembers(project.id, 'CHAT_MESSAGE', { projectId: project.id, content: parsed.data.content }, session.user.id);
	return NextResponse.json(msg, { status: 201 });
}