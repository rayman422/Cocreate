import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { z } from 'zod';

const ContributionSchema = z.object({
	kind: z.enum(['TASK_COMPLETED', 'ARTIFACT_ADDED', 'ARTIFACT_VERSIONED', 'PR_MERGED', 'CREDIT_CLAIMED', 'CREDIT_ACCEPTED']),
	taskId: z.string().optional(),
	artifactId: z.string().optional(),
	weight: z.number().int().min(1).max(10).default(1),
	note: z.string().optional()
});

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

	const json = await req.json();
	const parsed = ContributionSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

	const project = await prisma.project.findUnique({ where: { slug: params.slug } });
	if (!project) return new NextResponse('Not found', { status: 404 });

	const event = await prisma.contributionEvent.create({
		data: {
			projectId: project.id,
			userId: session.user.id,
			kind: parsed.data.kind,
			weight: parsed.data.weight,
			note: parsed.data.note ?? null,
			taskId: parsed.data.taskId ?? null,
			artifactId: parsed.data.artifactId ?? null
		}
	});
	return NextResponse.json(event, { status: 201 });
}