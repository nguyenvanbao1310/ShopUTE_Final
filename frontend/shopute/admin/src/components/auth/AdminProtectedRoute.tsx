'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStore } from '@/store/authStore';

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    authStore.restore();
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
      router.replace('/auth/login');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-gray-500 text-sm">Đang kiểm tra đăng nhập...</div>
      </div>
    );
  }

  return <>{children}</>;
}
