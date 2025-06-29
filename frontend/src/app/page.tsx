'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogsModal from './components/LogsModal';
import HashForm from './components/HashForm';

export default function MainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Проверяем роль пользователя из сессии
  const isAdmin = session.user?.role === 'admin';

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Панель управления
            </h1>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
            >
              Выйти
            </button>
          </div>

          <div className='bg-gray-50 rounded-lg p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>
              Информация о пользователе
            </h2>
            <div className='space-y-2'>
              <p>
                <strong>Имя:</strong> {session.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {session.user?.email}
              </p>
              <p>
                <strong>Провайдер:</strong> Яндекс.ID
              </p>
              <p>
                <strong>Роль:</strong>
                <span
                  className={`ml-2 font-semibold ${
                    session.user?.role === 'admin'
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {session.user?.role === 'admin'
                    ? 'Администратор'
                    : 'Пользователь'}
                </span>
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className='bg-yellow-50 rounded-lg p-6 mb-6'>
              <h2 className='text-xl font-semibold mb-4'>Администрирование</h2>
              <button
                onClick={() => setIsLogsModalOpen(true)}
                className='px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors'
              >
                Логи и история
              </button>
            </div>
          )}

          <div className='bg-blue-50 rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>Сервис хеширования</h2>
            <HashForm />
          </div>
        </div>
      </div>

      <LogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />
    </div>
  );
}
