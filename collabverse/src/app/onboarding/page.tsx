"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Option = { id: string; name: string };

export default function OnboardingPage() {
	const [disciplines, setDisciplines] = useState<Option[]>([]);
	const [skills, setSkills] = useState<Option[]>([]);
	const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [availability, setAvailability] = useState('Open to collaborate');
	const [bio, setBio] = useState('');
	const router = useRouter();

	useEffect(() => {
		(async () => {
			const res = await fetch('/api/profile');
			if (res.status === 401) return;
			const current = await res.json();
			// fetch choices
			const [disc, sk] = await Promise.all([
				fetch('/api/choices?type=disciplines').then((r) => r.json()),
				fetch('/api/choices?type=skills').then((r) => r.json())
			]);
			setDisciplines(disc);
			setSkills(sk);
			if (current) {
				setSelectedDisciplines(current.disciplines?.map((d: Option) => d.id) ?? []);
				setSelectedSkills(current.skills?.map((s: Option) => s.id) ?? []);
				setAvailability(current.availability ?? '');
				setBio(current.bio ?? '');
			}
		})();
	}, []);

	async function save() {
		const res = await fetch('/api/profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				bio,
				availability,
				disciplineIds: selectedDisciplines,
				skillIds: selectedSkills
			})
		});
		if (res.ok) router.push('/dashboard');
	}

	return (
		<div className="mx-auto max-w-2xl grid gap-6">
			<h1 className="text-2xl font-semibold">Onboarding</h1>
			<div className="grid gap-2">
				<label className="font-medium">Disciplines</label>
				<div className="flex flex-wrap gap-2">
					{disciplines.map((d) => (
						<button key={d.id} onClick={() => setSelectedDisciplines((prev) => prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id])} className={`rounded border px-3 py-1 ${selectedDisciplines.includes(d.id) ? 'bg-black text-white' : ''}`}>{d.name}</button>
					))}
				</div>
			</div>
			<div className="grid gap-2">
				<label className="font-medium">Skills</label>
				<div className="flex flex-wrap gap-2">
					{skills.map((s) => (
						<button key={s.id} onClick={() => setSelectedSkills((prev) => prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id])} className={`rounded border px-3 py-1 ${selectedSkills.includes(s.id) ? 'bg-black text-white' : ''}`}>{s.name}</button>
					))}
				</div>
			</div>
			<div className="grid gap-2">
				<label className="font-medium">Availability</label>
				<input className="border p-2" value={availability} onChange={(e) => setAvailability(e.target.value)} />
			</div>
			<div className="grid gap-2">
				<label className="font-medium">Bio</label>
				<textarea className="border p-2" value={bio} onChange={(e) => setBio(e.target.value)} rows={5} />
			</div>
			<div>
				<button onClick={save} className="rounded bg-black px-4 py-2 text-white">Save</button>
			</div>
		</div>
	);
}