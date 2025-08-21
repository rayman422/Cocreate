"use client";
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

type Message = { id: string; content: string; createdAt: string; user: { name: string | null; email: string | null } };

export default function ProjectChatPage() {
	const params = useParams<{ slug: string }>();
	const slug = params.slug;
	const [messages, setMessages] = useState<Message[]>([]);
	const [content, setContent] = useState('');
	const bottomRef = useRef<HTMLDivElement>(null);

	async function load() {
		const res = await fetch(`/api/projects/${slug}/chat`, { cache: 'no-store' });
		if (res.ok) setMessages(await res.json());
	}

	useEffect(() => {
		load();
		const t = setInterval(load, 3000);
		return () => clearInterval(t);
	}, [slug]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages.length]);

	async function send() {
		if (!content.trim()) return;
		const res = await fetch(`/api/projects/${slug}/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content })
		});
		if (res.ok) {
			setContent('');
			load();
		}
	}

	return (
		<div className="mx-auto max-w-2xl grid gap-4">
			<h1 className="text-2xl font-semibold">Project chat</h1>
			<div className="h-[50vh] overflow-y-auto rounded border p-3 bg-white">
				{messages.map((m) => (
					<div key={m.id} className="mb-2">
						<div className="text-sm text-slate-500">{new Date(m.createdAt).toLocaleTimeString()} — {m.user.name ?? m.user.email ?? 'user'}</div>
						<div>{m.content}</div>
					</div>
				))}
				<div ref={bottomRef} />
			</div>
			<div className="flex gap-2">
				<input className="border p-2 flex-1" placeholder="Type a message..." value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
				<button className="rounded bg-black px-4 py-2 text-white" onClick={send}>Send</button>
			</div>
		</div>
	);
}