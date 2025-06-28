'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Если пользователь уже авторизован, перенаправляем на главную
      router.push('/');
    }
  }, [session, status, router]);

  const handleYandexLogin = () => {
    signIn('yandex', { callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать
          </h1>
          <p className="text-gray-600">
            Войдите в сервис хеширования строк
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <button
            onClick={handleYandexLogin}
            className="flex items-center justify-center px-8 py-3
             border border-transparent text-base font-medium rounded-lg
              text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none
               focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50
                disabled:cursor-not-allowed transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Войти через Яндекс.ID
          </button>
        </div>
      </div>
    </div>
  );
} 