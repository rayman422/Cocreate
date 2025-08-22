"use client";
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function NewArtifactPage() {
	const params = useParams<{ slug: string }>();
	const slug = params.slug;
	const [title, setTitle] = useState('Artifact title');
	const [type, setType] = useState<'FILE' | 'LINK'>('LINK');
	const [url, setUrl] = useState('https://example.com');
	const router = useRouter();

	return (
		<div className="mx-auto max-w-xl">
			<h1 className="mb-4 text-2xl font-semibold">Add artifact</h1>
			<form
				className="grid gap-3"
				onSubmit={async (e) => {
					e.preventDefault();
					const res = await fetch(`/api/projects/${slug}/artifacts`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ title, type, url })
					});
					if (res.ok) router.push(`/projects/${slug}`);
				}}
			>
				<input className="border p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
				<select className="border p-2" value={type} onChange={(e) => setType(e.target.value as any)}>
					<option value="LINK">Link</option>
					<option value="FILE" disabled>File (coming soon)</option>
				</select>
				{type === 'LINK' && (
					<input className="border p-2" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
				)}
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Create</button>
			</form>
		</div>
	);
}