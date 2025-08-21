import { prisma } from '@/server/prisma';

const DEFAULT_DISCIPLINES = [
	'Artist',
	'Designer',
	'Inventor',
	'Scientist',
	'Coder'
];

const DEFAULT_SKILLS = [
	'Python',
	'JavaScript',
	'TypeScript',
	'UI/UX',
	'3D Modeling',
	'CAD',
	'Writing',
	'Experiment Design'
];

export async function ensureSeedData() {
	await Promise.all(
		DEFAULT_DISCIPLINES.map((name) =>
			prisma.discipline.upsert({ where: { name }, update: {}, create: { name } })
		)
	);
	await Promise.all(
		DEFAULT_SKILLS.map((name) =>
			prisma.skill.upsert({ where: { name }, update: {}, create: { name } })
		)
	);
}

export async function getSeedChoices() {
	const [disciplines, skills] = await Promise.all([
		prisma.discipline.findMany({ orderBy: { name: 'asc' } }),
		prisma.skill.findMany({ orderBy: { name: 'asc' } })
	]);
	return { disciplines, skills };
}