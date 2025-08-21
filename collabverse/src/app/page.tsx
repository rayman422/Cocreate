import Link from 'next/link';

export default function HomePage() {
	return (
		<div className="grid gap-8">
			<section className="grid gap-3">
				<h1 className="text-3xl font-bold">Create together across disciplines</h1>
				<p className="text-slate-600 max-w-2xl">
					CollabVerse is where artists, scientists, designers, and coders discover each other,
					form teams, and build ideas into real projects with built-in credit tracking.
				</p>
				<div className="flex gap-3">
					<a href="/api/auth/signin" className="rounded bg-black px-4 py-2 text-white">Sign in</a>
					<Link href="/dashboard" className="rounded border px-4 py-2">Go to dashboard</Link>
				</div>
			</section>
		</div>
	);
}