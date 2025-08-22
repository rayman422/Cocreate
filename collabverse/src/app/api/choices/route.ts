import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { ensureSeedData } from '@/lib/seed';

export async function GET(req: NextRequest) {
	await ensureSeedData();
	const { searchParams } = new URL(req.url);
	const type = searchParams.get('type');
	if (type === 'disciplines') {
		const data = await prisma.discipline.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
		return NextResponse.json(data);
	}
	if (type === 'skills') {
		const data = await prisma.skill.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
		return NextResponse.json(data);
	}
	return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}