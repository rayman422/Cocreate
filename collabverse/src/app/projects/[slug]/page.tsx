import { prisma } from '@/server/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { slug: string } }) {
	const project = await prisma.project.findUnique({
		where: { slug: params.slug },
		include: {
			memberships: { include: { user: true } },
			tasks: true,
			artifacts: true
		}
	});
	if (!project) return notFound();
	return (
		<div className="grid gap-6">
			<div>
				<h1 className="text-2xl font-semibold">{project.title}</h1>
				<p className="text-slate-600">{project.summary}</p>
				<div className="text-xs text-slate-500">Visibility: {project.visibility} • License: {project.license}</div>
			</div>
			<section className="grid gap-2">
				<h2 className="text-xl font-semibold">Team</h2>
				<ul className="list-disc pl-5 text-slate-700">
					{project.memberships.map((m) => (
						<li key={m.id}>{m.user.name ?? m.user.email} — {m.role}</li>
					))}
				</ul>
			</section>
			<section className="grid gap-2">
				<h2 className="text-xl font-semibold">Tasks</h2>
				<Link href={`/projects/${project.slug}/tasks/new`} className="rounded border px-3 py-1 w-fit">New task</Link>
				<ul className="grid gap-1">
					{project.tasks.map((t) => (
						<li key={t.id} className="rounded border p-2">
							<div className="font-medium">{t.title}</div>
							<div className="text-xs text-slate-500">{t.status} {t.assigneeId ? `• assigned` : ''}</div>
						</li>
					))}
				</ul>
			</section>
			<section className="grid gap-2">
				<h2 className="text-xl font-semibold">Artifacts</h2>
				<Link href={`/projects/${project.slug}/artifacts/new`} className="rounded border px-3 py-1 w-fit">Add artifact</Link>
				<ul className="grid gap-1">
					{project.artifacts.map((a) => (
						<li key={a.id} className="rounded border p-2">
							<div className="font-medium">{a.title}</div>
							<div className="text-xs text-slate-500">{a.type} {a.latestVersion ? `• v${a.latestVersion}` : ''}</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}