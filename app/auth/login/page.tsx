import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Ideas App',
  description: 'Sign in to manage your ideas',
};

export default function LoginPage() {
  return <LoginForm />;
}