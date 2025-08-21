import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { z } from 'zod';

const ReportSchema = z.object({ targetType: z.string(), targetId: z.string(), reason: z.string().min(5) });

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
	const json = await req.json();
	const parsed = ReportSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	const report = await prisma.report.create({ data: { reporterId: session.user.id, ...parsed.data } });
	return NextResponse.json(report, { status: 201 });
}

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
	const me = await prisma.user.findUnique({ where: { id: session.user.id } });
	if (!me?.isAdmin) return new NextResponse('Forbidden', { status: 403 });
	const reports = await prisma.report.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
	return NextResponse.json(reports);
}