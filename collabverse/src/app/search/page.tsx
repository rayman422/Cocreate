"use client";
import { useState } from 'react';
import Link from 'next/link';

type User = { id: string; name: string | null; email: string | null };
type Project = { id: string; title: string; slug: string; summary: string };

export default function SearchPage() {
	const [q, setQ] = useState('');
	const [users, setUsers] = useState<User[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);

	async function search() {
		const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
		if (res.ok) {
			const data = await res.json();
			setUsers(data.users);
			setProjects(data.projects);
		}
	}

	return (
		<div className="mx-auto max-w-3xl grid gap-6">
			<h1 className="text-2xl font-semibold">Search</h1>
			<div className="flex gap-2">
				<input className="border p-2 flex-1" placeholder="Search people and projects..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search(); }} />
				<button className="rounded bg-black px-4 py-2 text-white" onClick={search}>Search</button>
			</div>
			<div className="grid gap-3">
				<h2 className="text-xl font-semibold">Projects</h2>
				<ul className="grid gap-1">
					{projects.map((p) => (
						<li key={p.id} className="rounded border p-2">
							<Link className="font-medium" href={`/projects/${p.slug}`}>{p.title}</Link>
							<div className="text-sm text-slate-600">{p.summary}</div>
						</li>
					))}
				</ul>
			</div>
			<div className="grid gap-3">
				<h2 className="text-xl font-semibold">People</h2>
				<ul className="grid gap-1">
					{users.map((u) => (
						<li key={u.id} className="rounded border p-2">
							<div className="font-medium">{u.name ?? u.email ?? 'User'}</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}