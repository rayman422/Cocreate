import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/prisma';

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
	const notifications = await prisma.notification.findMany({ where: { userId: session.user.id, read: false }, orderBy: { createdAt: 'desc' }, take: 50 });
	return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
	const { ids } = await req.json();
	await prisma.notification.updateMany({ where: { userId: session.user.id, id: { in: ids ?? [] } }, data: { read: true } });
	return NextResponse.json({ ok: true });
}