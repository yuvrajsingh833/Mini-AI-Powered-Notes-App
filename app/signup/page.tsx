import SignupForm from '@/components/auth/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - NotesAI',
  description: 'Create a new NotesAI account',
};

export default function SignupPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 w-full">
        <SignupForm />
      </div>
    </div>
  );
}