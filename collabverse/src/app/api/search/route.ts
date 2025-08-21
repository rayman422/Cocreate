import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const q = (searchParams.get('q') ?? '').trim();
	if (!q) return NextResponse.json({ users: [], projects: [] });
	const [users, projects] = await Promise.all([
		prisma.user.findMany({
			where: {
				OR: [
					{ name: { contains: q } },
					{ email: { contains: q } },
					{ profile: { is: { bio: { contains: q } } } }
				]
			},
			select: { id: true, name: true, email: true }
		}),
		prisma.project.findMany({
			where: {
				OR: [
					{ title: { contains: q } },
					{ summary: { contains: q } }
				]
			},
			select: { id: true, title: true, slug: true, summary: true }
		})
	]);
	return NextResponse.json({ users, projects });
}