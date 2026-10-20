import { cookies } from 'next/headers';
import { loginAction } from './actions';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const store = await cookies();
  const authed = store.get('admin_session')?.value === process.env.ADMIN_PASSWORD;
  const { error } = await searchParams;

  if (authed) return <AdminDashboard />;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-xs flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl text-foreground">Admin</h1>
          <p className="text-muted-foreground text-sm">Birthday dinner</p>
        </div>

        <form action={loginAction} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-gold/50 transition-colors"
          />
          {error && (
            <p className="text-red-400 text-xs">Wrong password.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gold text-[#0f0e0d] text-sm font-medium tracking-wide"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
