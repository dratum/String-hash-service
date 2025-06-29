'use client';

import { useState, useEffect } from 'react';
import { getHashHistory, HashHistoryItem } from '../actions/hash';

export default function HashHistory() {
  const [history, setHistory] = useState<HashHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getHashHistory();

      if (result.success && result.history) {
        setHistory(result.history);
      } else {
        setError(result.error || 'Ошибка получения истории');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold text-gray-900'>
          История хеширования
        </h3>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className='px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50'
        >
          {loading ? 'Обновление...' : 'Обновить'}
        </button>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      <div className='overflow-auto max-h-96'>
        {history.length > 0 ? (
          <div className='space-y-3'>
            {history.map(item => (
              <div
                key={item.id}
                className='p-4 bg-gray-50 rounded-lg border border-gray-200'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm'>
                  <div>
                    <strong>Алгоритм:</strong>
                    <br />
                    <span className='font-mono text-blue-600'>
                      {item.algorithm_name.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <strong>Исходная строка:</strong>
                    <br />
                    <div className='font-mono text-gray-700 break-all max-w-xs'>
                      {item.input_string.length > 50
                        ? `${item.input_string.substring(0, 50)}...`
                        : item.input_string}
                    </div>
                  </div>
                  <div>
                    <strong>Хеш:</strong>
                    <br />
                    <div className='flex items-center gap-2'>
                      <span className='font-mono text-gray-700 break-all max-w-xs'>
                        {item.hash_result}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.hash_result)}
                        className='text-xs text-blue-600 hover:text-blue-800'
                        title='Копировать хеш'
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div>
                    <strong>Дата:</strong>
                    <br />
                    {formatDate(item.created_at)}
                  </div>
                </div>

                {item.input_string.length > 50 && (
                  <details className='mt-2'>
                    <summary className='text-sm text-blue-600 cursor-pointer hover:text-blue-800'>
                      Показать полную строку
                    </summary>
                    <div className='mt-2 p-2 bg-white rounded border font-mono text-sm break-all'>
                      {item.input_string}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className='text-center text-gray-500 py-8'>
            История хеширования пуста
          </div>
        ) : null}
      </div>
    </div>
  );
}
