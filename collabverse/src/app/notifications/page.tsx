"use client";
import { useEffect, useState } from 'react';

type Notification = { id: string; type: string; payload: string | null; createdAt: string };

export default function NotificationsPage() {
	const [items, setItems] = useState<Notification[]>([]);
	useEffect(() => {
		(async () => {
			const res = await fetch('/api/notifications');
			if (res.ok) setItems(await res.json());
		})();
	}, []);
	async function markAll() {
		const ids = items.map((n) => n.id);
		await fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) });
		setItems([]);
	}
	return (
		<div className="mx-auto max-w-2xl grid gap-4">
			<h1 className="text-2xl font-semibold">Notifications</h1>
			<button className="rounded border px-3 py-1 w-fit" onClick={markAll}>Mark all as read</button>
			<ul className="grid gap-2">
				{items.map((n) => (
					<li key={n.id} className="rounded border p-2">
						<div className="text-sm text-slate-500">{new Date(n.createdAt).toLocaleString()} — {n.type}</div>
						<div>{n.payload}</div>
					</li>
				))}
				{items.length === 0 && <div className="text-slate-600">No unread notifications</div>}
			</ul>
		</div>
	);
}