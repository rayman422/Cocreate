import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'CollabVerse',
	description: 'A global hub for creators, thinkers, and builders.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen antialiased">
				<header className="border-b bg-white">
					<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
						<Link href="/" className="text-xl font-semibold">CollabVerse</Link>
						<nav className="flex items-center gap-4 text-sm">
							<Link href="/dashboard">Dashboard</Link>
							<a href="/api/auth/signin">Sign in</a>
						</nav>
					</div>
				</header>
				<main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
			</body>
		</html>
	);
}