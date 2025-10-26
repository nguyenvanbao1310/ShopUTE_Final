'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    authStore.restore(); // khôi phục từ localStorage
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
      router.replace('/auth/login');
    } else {
      router.replace('/admin');
    }
  }, [router]);

  return null;
}