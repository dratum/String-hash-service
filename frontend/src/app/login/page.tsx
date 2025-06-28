'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthLogin = async (provider: 'yandex' | 'vk') => {
    setIsLoading(true);
    
    try {
      // Здесь будет логика OAuth аутентификации
      console.log(`Logging in with ${provider}`);
      
      // Временная заглушка - редирект на OAuth провайдера
      const authUrl = provider === 'yandex' 
        ? 'https://oauth.yandex.ru/authorize?response_type=code&client_id=YOUR_CLIENT_ID'
        : 'https://oauth.vk.com/authorize?client_id=YOUR_CLIENT_ID&scope=email&response_type=code';
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('OAuth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={() => handleOAuthLogin('yandex')}
            disabled={isLoading}
            className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Войти через Яндекс.ID
              </>
            )}
          </button>
          <button
            onClick={() => handleOAuthLogin('vk')}
            disabled={isLoading}
            className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Войти через VK ID
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 