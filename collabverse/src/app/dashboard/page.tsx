import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { prisma } from '@/server/prisma';

export default async function DashboardPage() {
	const session = await getServerSession();
	const userId = session?.user?.id;
	const profile = userId ? await prisma.profile.findUnique({ where: { userId }, include: { disciplines: true, skills: true } }) : null;
	const projects = userId ? await prisma.project.findMany({ where: { ownerId: userId }, orderBy: { updatedAt: 'desc' }, take: 5 }) : [];
	return (
		<div className="grid gap-6">
			<h1 className="text-2xl font-semibold">Dashboard</h1>
			{!session?.user ? (
				<div className="text-slate-700">
					Please <a className="underline" href="/api/auth/signin">sign in</a> to continue.
				</div>
			) : null}
			{session?.user && !profile?.disciplines?.length && (
				<div className="rounded border bg-yellow-50 p-3 text-sm">
					Complete your <Link className="underline" href="/onboarding">onboarding</Link> to get better matches.
				</div>
			)}
			<div className="grid gap-2">
				<div className="flex gap-3">
					<Link href="/projects/new" className="rounded bg-black px-4 py-2 text-white w-fit">Create project</Link>
					<Link href="/search" className="rounded border px-4 py-2 w-fit">Search</Link>
					<Link href="/showcase" className="rounded border px-4 py-2 w-fit">Showcase</Link>
				</div>
			</div>
			<div className="grid gap-2">
				<h2 className="text-xl font-semibold">Your projects</h2>
				<ul className="grid gap-1">
					{projects.map((p) => (
						<li key={p.id} className="rounded border p-2">
							<Link className="font-medium" href={`/projects/${p.slug}`}>{p.title}</Link>
							<div className="text-sm text-slate-600">{p.summary}</div>
							<div className="text-xs text-slate-500 flex gap-2">
								<Link href={`/projects/${p.slug}/chat`} className="underline">Chat</Link>
								<Link href={`/projects/${p.slug}/publish`} className="underline">Publish</Link>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}