import { prisma } from '@/server/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function PublishPage({ params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) redirect('/api/auth/signin');
	const project = await prisma.project.findUnique({ where: { slug: params.slug } });
	if (!project) redirect('/');
	await prisma.project.update({ where: { id: project.id }, data: { showcasedAt: new Date() } });
	redirect(`/projects/${params.slug}`);
}