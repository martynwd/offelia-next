"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsChecking(false);
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('admin_token');

    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/admin/login');
      return;
    }

    // Verify token with server
    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          console.log('Token invalid, redirecting to login');
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
          setIsChecking(false);
        }
      })
      .catch(err => {
        console.error('Auth check failed:', err);
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      });
  }, [router, pathname]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return <>{children}</>;
}
