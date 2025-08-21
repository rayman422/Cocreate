import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { z } from 'zod';

const CreateArtifactSchema = z.object({
	title: z.string().min(2),
	type: z.enum(['FILE', 'LINK']),
	url: z.string().url().optional()
});

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

	const json = await req.json();
	const parsed = CreateArtifactSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

	const project = await prisma.project.findUnique({ where: { slug: params.slug } });
	if (!project) return new NextResponse('Not found', { status: 404 });

	const { title, type, url } = parsed.data;
	if (type === 'LINK' && !url) return new NextResponse('URL required for LINK', { status: 400 });

	const artifact = await prisma.artifact.create({
		data: {
			projectId: project.id,
			title,
			type,
			url: url ?? null,
			latestVersion: 1,
			versions: {
				create: {
					version: 1,
					contentHash: 'link:' + (url ?? 'n/a'),
					createdById: session.user.id
				}
			}
		}
	});
	return NextResponse.json(artifact, { status: 201 });
}