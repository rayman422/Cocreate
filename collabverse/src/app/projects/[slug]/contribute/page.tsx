"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ContributePage() {
	const params = useParams<{ slug: string }>();
	const slug = params.slug;
	const [kind, setKind] = useState('TASK_COMPLETED');
	const [note, setNote] = useState('');
	const router = useRouter();
	return (
		<div className="mx-auto max-w-xl">
			<h1 className="mb-4 text-2xl font-semibold">Record contribution</h1>
			<form
				className="grid gap-3"
				onSubmit={async (e) => {
					e.preventDefault();
					const res = await fetch(`/api/projects/${slug}/contributions`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ kind, note, weight: 1 })
					});
					if (res.ok) router.push(`/projects/${slug}`);
				}}
			>
				<select className="border p-2" value={kind} onChange={(e) => setKind(e.target.value)}>
					<option value="TASK_COMPLETED">Task completed</option>
					<option value="ARTIFACT_ADDED">Artifact added</option>
					<option value="ARTIFACT_VERSIONED">Artifact versioned</option>
					<option value="PR_MERGED">PR merged</option>
					<option value="CREDIT_CLAIMED">Credit claimed</option>
					<option value="CREDIT_ACCEPTED">Credit accepted</option>
				</select>
				<input className="border p-2" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
				<button className="rounded bg-black px-4 py-2 text-white" type="submit">Record</button>
			</form>
		</div>
	);
}