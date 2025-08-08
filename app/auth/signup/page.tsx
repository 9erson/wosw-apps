import { SignUpForm } from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Ideas App',
  description: 'Create an account to start managing your ideas',
};

export default function SignUpPage() {
  return <SignUpForm />;
}