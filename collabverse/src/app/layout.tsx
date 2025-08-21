import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
	title: 'CollabVerse',
	description: 'A global hub for creators, thinkers, and builders.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession();
	const userId = session?.user?.id;
	const unread = userId ? await prisma.notification.count({ where: { userId, read: false } }) : 0;
	return (
		<html lang="en">
			<body className="min-h-screen antialiased">
				<header className="border-b bg-white">
					<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
						<Link href="/" className="text-xl font-semibold">CollabVerse</Link>
						<nav className="flex items-center gap-4 text-sm">
							<Link href="/dashboard">Dashboard</Link>
							<Link href="/search">Search</Link>
							<Link href="/showcase">Showcase</Link>
							<Link href="/notifications" className="relative">Notifications{unread > 0 && <span className="ml-1 rounded bg-red-600 px-1.5 py-0.5 text-white text-[10px]">{unread}</span>}</Link>
							{session?.user ? <a href="/api/auth/signout">Sign out</a> : <a href="/api/auth/signin">Sign in</a>}
						</nav>
					</div>
				</header>
				<main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
			</body>
		</html>
	);
}