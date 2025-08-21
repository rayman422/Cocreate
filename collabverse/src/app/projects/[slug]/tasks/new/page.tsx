"use client";
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function NewTaskPage() {
	const params = useParams<{ slug: string }>();
	const slug = params.slug;
	const [title, setTitle] = useState('New task');
	const [description, setDescription] = useState('');
	const router = useRouter();
	return (
		<div className="mx-auto max-w-xl">
			<h1 className="mb-4 text-2xl font-semibold">New task</h1>
			<form
				className="grid gap-3"
				onSubmit={async (e) => {
					e.preventDefault();
					const res = await fetch(`/api/projects/${slug}/tasks`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ title, description })
					});
					if (res.ok) {
						router.push(`/projects/${slug}`);
					} else {
						alert('Failed');
					}
				}}
			>
				<input className="border p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
				<textarea className="border p-2" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Create task</button>
			</form>
		</div>
	);
}