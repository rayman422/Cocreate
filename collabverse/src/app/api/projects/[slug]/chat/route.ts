import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { z } from 'zod';

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
	const json = await req.json();
	const parsed = SendSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	const msg = await prisma.chatMessage.create({ data: { projectId: project.id, userId: session.user.id, content: parsed.data.content } });
	return NextResponse.json(msg, { status: 201 });
}