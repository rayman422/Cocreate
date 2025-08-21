import DevLoginForm from '../[...nextauth]/_components/DevLoginForm';

export default function SignInPage() {
	return (
		<div className="mx-auto max-w-md">
			<h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
			<DevLoginForm />
		</div>
	);
}