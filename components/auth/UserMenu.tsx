'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="skeleton h-10 w-32"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/login" className="btn btn-ghost btn-sm">
          Sign In
        </Link>
        <Link href="/auth/signup" className="btn btn-primary btn-sm">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full bg-primary text-primary-content">
          <div className="flex items-center justify-center h-full text-lg font-semibold">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li className="menu-title">
          <span className="truncate">{user.email}</span>
        </li>
        <li>
          <Link href="/ideas" className="justify-between">
            My Ideas
            <span className="badge badge-primary badge-sm">View</span>
          </Link>
        </li>
        <li>
          <Link href="/profile">Profile Settings</Link>
        </li>
        <li>
          <button onClick={handleSignOut} className="text-error">
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}