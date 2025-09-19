// pages/admin/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      // Redirect to dashboard if authenticated
      router.push('/admin/dashboard');
    } else {
      // Redirect to login if not authenticated
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <Head>
        <title>Stoneform Capital | Admin Portal</title>
        <meta name="description" content="Admin portal for Stoneform Capital" />
      </Head>

      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Redirecting to admin portal...</p>
      </div>
    </div>
  );
}