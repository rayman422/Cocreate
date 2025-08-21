"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function DevLoginForm() {
	const [email, setEmail] = useState('dev@example.com');
	const [name, setName] = useState('Dev User');
	return (
		<form
			className="grid gap-3"
			onSubmit={async (e) => {
				e.preventDefault();
				await signIn('credentials', { email, name, callbackUrl: '/dashboard' });
			}}
		>
			<input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<input className="border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
			<button className="rounded bg-black px-4 py-2 text-white" type="submit">Dev sign in</button>
		</form>
	);
}