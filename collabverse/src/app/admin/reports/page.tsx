import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function AdminReportsPage() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) redirect('/api/auth/signin');
	const me = await prisma.user.findUnique({ where: { id: session.user.id } });
	if (!me?.isAdmin) redirect('/');
	const reports = await prisma.report.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
	return (
		<div className="mx-auto max-w-4xl grid gap-4">
			<h1 className="text-2xl font-semibold">Reports</h1>
			<ul className="grid gap-2">
				{reports.map((r) => (
					<li key={r.id} className="rounded border p-2 text-sm">
						<div>Target: {r.targetType} {r.targetId}</div>
						<div>Reason: {r.reason}</div>
						<div className="text-slate-500">Status: {r.status} • {new Date(r.createdAt).toLocaleString()}</div>
					</li>
				))}
				{reports.length === 0 && <div className="text-slate-600">No reports</div>}
			</ul>
		</div>
	);
}