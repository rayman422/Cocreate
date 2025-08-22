import type { NextAuthOptions } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/server/prisma';
import { z } from 'zod';

const providers = [] as any[];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
	providers.push(GitHub({
		clientId: process.env.GITHUB_ID,
		clientSecret: process.env.GITHUB_SECRET
	}));
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	providers.push(Google({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET
	}));
}

if (providers.length === 0) {
	providers.push(Credentials({
		name: 'Dev Login',
		credentials: {
			email: { label: 'Email', type: 'email' },
			name: { label: 'Name', type: 'text' }
		},
		authorize: async (raw) => {
			const schema = z.object({ email: z.string().email(), name: z.string().min(1) });
			const parsed = schema.safeParse(raw);
			if (!parsed.success) return null;
			const { email, name } = parsed.data;
			let user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				user = await prisma.user.create({ data: { email, name } });
			}
			return { id: user.id, email: user.email ?? undefined, name: user.name ?? undefined };
		}
	}));
}

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers,
	callbacks: {
		session: async ({ session, user }) => {
			if (session.user) {
				(session.user as any).id = user.id;
			}
			return session;
		}
	}
};