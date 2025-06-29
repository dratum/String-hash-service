'use client';

import { useState } from 'react';
import { getAuthLogs, AuthLog } from '../actions/logs';

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogsModal({ isOpen, onClose }: LogsModalProps) {
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
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Логи аутентификации</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

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

        <div className="overflow-auto flex-1">
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
      </div>
    </div>
  );
} 