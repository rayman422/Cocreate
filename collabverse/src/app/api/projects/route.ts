import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { z } from 'zod';

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');
}

async function generateUniqueSlug(title: string): Promise<string> {
	const base = slugify(title);
	if (!base) {
		return (Math.random() + 1).toString(36).substring(2, 8);
	}
	let candidate = base;
	let i = 1;
	while (true) {
		const existing = await prisma.project.findUnique({ where: { slug: candidate } });
		if (!existing) return candidate;
		candidate = `${base}-${i++}`;
	}
}

export async function GET() {
	const projects = await prisma.project.findMany({
		orderBy: { createdAt: 'desc' },
		take: 20,
		select: {
			id: true,
			title: true,
			slug: true,
			summary: true,
			visibility: true,
			createdAt: true
		}
	});
	return NextResponse.json(projects);
}

const CreateProjectSchema = z.object({
	title: z.string().min(3),
	summary: z.string().min(10).max(4000),
	license: z.string().min(1),
	visibility: z.enum(['PUBLIC', 'PRIVATE', 'INVITE_ONLY'])
});

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return new NextResponse('Unauthorized', { status: 401 });
	}
	const json = await req.json();
	const parsed = CreateProjectSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
	}
	const { title, summary, license, visibility } = parsed.data;
	const slug = await generateUniqueSlug(title);

	const project = await prisma.project.create({
		data: {
			title,
			slug,
			summary,
			license,
			visibility,
			ownerId: session.user.id,
			memberships: {
				create: { userId: session.user.id, role: 'OWNER', status: 'ACTIVE' }
			}
		},
		select: { id: true, slug: true }
	});

	return NextResponse.json(project, { status: 201 });
}