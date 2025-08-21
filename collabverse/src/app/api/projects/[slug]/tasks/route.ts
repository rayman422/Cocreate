import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { z } from 'zod';

const CreateTaskSchema = z.object({
	title: z.string().min(2),
	description: z.string().optional()
});

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

	const json = await req.json();
	const parsed = CreateTaskSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

	const project = await prisma.project.findUnique({ where: { slug: params.slug } });
	if (!project) return new NextResponse('Not found', { status: 404 });

	const task = await prisma.task.create({
		data: {
			projectId: project.id,
			title: parsed.data.title,
			description: parsed.data.description ?? null
		}
	});
	return NextResponse.json(task, { status: 201 });
}