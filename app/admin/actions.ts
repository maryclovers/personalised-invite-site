'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const store = await cookies();
    store.set('admin_session', password, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    redirect('/admin');
  }
  redirect('/admin?error=1');
}
