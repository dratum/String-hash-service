'use client';

import { useState } from 'react';
import { getAuthLogs, AuthLog } from '../actions/logs';
import HashHistory from './HashHistory';

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'auth' | 'hash';

export default function LogsModal({ isOpen, onClose }: LogsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('auth');
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAuthLogs();
      
      if (result.success && result.logs) {
        setLogs(result.logs);
      } else {
        setError(result.error || 'Ошибка получения логов');
      }
    } catch (err) {
      setError('Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Логи и история</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Вкладки */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'auth'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Логи аутентификации
          </button>
          <button
            onClick={() => setActiveTab('hash')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'hash'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            История хеширования
          </button>
        </div>

        {/* Контент вкладок */}
        <div className="overflow-auto flex-1">
          {activeTab === 'auth' ? (
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={fetchLogs}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Загрузка...' : 'Обновить логи'}
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {logs.length > 0 ? (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-4 rounded-lg border ${
                        log.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <div>
                          <strong>Пользователь:</strong>
                          <br />
                          {log.user_name || 'Неизвестно'} ({log.user_email || 'Нет email'})
                        </div>
                        <div>
                          <strong>Действие:</strong>
                          <br />
                          {log.action}
                        </div>
                        <div>
                          <strong>Статус:</strong>
                          <br />
                          <span className={log.success ? 'text-green-600' : 'text-red-600'}>
                            {log.success ? 'Успешно' : 'Ошибка'}
                          </span>
                        </div>
                        <div>
                          <strong>Дата:</strong>
                          <br />
                          {formatDate(log.created_at)}
                        </div>
                      </div>
                      
                      {log.ip_address && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>IP:</strong> {log.ip_address}
                        </div>
                      )}
                      
                      {log.error_message && (
                        <div className="mt-2 text-sm text-red-600">
                          <strong>Ошибка:</strong> {log.error_message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : !loading && !error ? (
                <div className="text-center text-gray-500 py-8">
                  Нажмите "Обновить логи" для загрузки данных
                </div>
              ) : null}
            </div>
          ) : (
            <HashHistory />
          )}
        </div>
      </div>
    </div>
  );
} 