import { prisma } from '@/server/prisma';
import Link from 'next/link';

export default async function ShowcasePage() {
	const projects = await prisma.project.findMany({
		where: { showcasedAt: { not: null }, visibility: 'PUBLIC' },
		orderBy: { showcasedAt: 'desc' },
		select: { id: true, title: true, slug: true, summary: true, showcasedAt: true }
	});
	return (
		<div className="mx-auto max-w-4xl grid gap-6">
			<h1 className="text-2xl font-semibold">Showcase</h1>
			<ul className="grid gap-3">
				{projects.map((p) => (
					<li key={p.id} className="rounded border p-3 bg-white">
						<Link className="text-lg font-medium" href={`/projects/${p.slug}`}>{p.title}</Link>
						<div className="text-sm text-slate-600">{p.summary}</div>
						<div className="text-xs text-slate-500">Published {p.showcasedAt && new Date(p.showcasedAt).toLocaleDateString()}</div>
					</li>
				))}
			</ul>
		</div>
	);
}