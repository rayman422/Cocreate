import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { z } from 'zod';
import { ensureSeedData } from '@/lib/seed';

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
	await ensureSeedData();
	const profile = await prisma.profile.findUnique({
		where: { userId: session.user.id },
		include: { disciplines: true, skills: true }
	});
	return NextResponse.json(profile ?? null);
}

const ProfileSchema = z.object({
	bio: z.string().max(500).optional(),
	availability: z.string().max(100).optional(),
	disciplineIds: z.array(z.string()).default([]),
	skillIds: z.array(z.string()).default([]),
	website: z.string().url().optional(),
	location: z.string().max(100).optional()
});

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
	await ensureSeedData();
	const json = await req.json();
	const parsed = ProfileSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	const { bio, availability, disciplineIds, skillIds, website, location } = parsed.data;
	const profile = await prisma.profile.upsert({
		where: { userId: session.user.id },
		update: {
			bio: bio ?? null,
			availability: availability ?? null,
			website: website ?? null,
			location: location ?? null,
			disciplines: { set: [], connect: disciplineIds.map((id) => ({ id })) },
			skills: { set: [], connect: skillIds.map((id) => ({ id })) }
		},
		create: {
			userId: session.user.id,
			bio: bio ?? null,
			availability: availability ?? null,
			website: website ?? null,
			location: location ?? null,
			disciplines: { connect: disciplineIds.map((id) => ({ id })) },
			skills: { connect: skillIds.map((id) => ({ id })) }
		},
		include: { disciplines: true, skills: true }
	});
	return NextResponse.json(profile);
}