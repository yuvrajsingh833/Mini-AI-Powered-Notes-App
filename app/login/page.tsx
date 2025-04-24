import LoginForm from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - NotesAI',
  description: 'Login to your NotesAI account',
};

export default function LoginPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 w-full">
        <LoginForm />
      </div>
    </div>
  );
}