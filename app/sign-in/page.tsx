import { AuthForm } from "@/components/auth-form"

export default async function SignInPage({
	searchParams,
}: {
	searchParams: Promise<{ reason?: string }>
}) {
	const { reason } = await searchParams
	const accessMessage = {
		session: "Sign-in succeeded, but this browser session was not available to the admin page. Clear localhost site cookies, restart the dev server, and sign in again.",
		"not-configured": "Admin access is not configured. Set ADMIN_EMAIL to the account email in .env.local, then restart the server.",
		"not-admin": "You are signed in, but this account does not match ADMIN_EMAIL.",
	}[reason ?? ""]

	return (
		<main className="grid min-h-screen place-items-center p-6">
			<AuthForm mode="sign-in" accessMessage={accessMessage} />
		</main>
	)
}
