"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
	const [title, setTitle] = useState('New Idea');
	const [summary, setSummary] = useState('Describe your project...');
	const [license, setLicense] = useState('MIT');
	const [visibility, setVisibility] = useState('PUBLIC');
	const router = useRouter();

	return (
		<div className="mx-auto max-w-2xl">
			<h1 className="mb-4 text-2xl font-semibold">Create project</h1>
			<form
				className="grid gap-3"
				onSubmit={async (e) => {
					e.preventDefault();
					const res = await fetch('/api/projects', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ title, summary, license, visibility })
					});
					if (res.ok) {
						const data = await res.json();
						router.push(`/projects/${data.slug}`);
					} else {
						alert('Failed to create project');
					}
				}}
			>
				<input className="border p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
				<textarea className="border p-2" value={summary} onChange={(e) => setSummary(e.target.value)} rows={5} />
				<div className="flex gap-3">
					<select className="border p-2" value={license} onChange={(e) => setLicense(e.target.value)}>
						<option value="MIT">MIT</option>
						<option value="Apache-2.0">Apache-2.0</option>
						<option value="GPL-3.0">GPL-3.0</option>
					</select>
					<select className="border p-2" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
						<option value="PUBLIC">Public</option>
						<option value="PRIVATE">Private</option>
						<option value="INVITE_ONLY">Invite only</option>
					</select>
				</div>
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Create</button>
			</form>
		</div>
	);
}