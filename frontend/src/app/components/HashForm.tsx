'use client';

import { useState } from 'react';
import { hashString, HashResult } from '../actions/hash';
import { Algorithms } from 'app/lib/algorithms';

export default function HashForm() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithms>('md5');
  const [result, setResult] = useState<HashResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Введите строку для хеширования');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await hashString(input, algorithm);

      if (response.success && response.result) {
        setResult(response.result);
      } else {
        setError(response.error || 'Ошибка хеширования');
      }
    } catch (err) {
      console.error(err)
      setError('Неизвестная ошибка %d');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='input'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Строка для хеширования
          </label>
          <textarea
            id='input'
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Введите текст для хеширования...'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            rows={4}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor='algorithm'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Алгоритм хеширования
          </label>
          <select
            id='algorithm'
            value={algorithm}
            onChange={e =>
              setAlgorithm(e.target.value as 'md5' | 'sha1' | 'sha256')
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            disabled={loading}
          >
            <option value='md5'>MD5</option>
            <option value='sha1'>SHA1</option>
            <option value='sha256'>SHA256</option>
          </select>
        </div>

        <button
          type='submit'
          disabled={loading || !input.trim()}
          className='w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {loading ? 'Хеширование...' : 'Хешировать'}
        </button>
      </form>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      {result && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-green-800 mb-3'>
            Результат хеширования
          </h3>

          <div className='space-y-3'>
            <div>
              <span className='text-sm font-medium text-gray-600'>
                Алгоритм:
              </span>
              <span className='ml-2 text-sm text-gray-900'>
                {result.algorithm.toUpperCase()}
              </span>
            </div>

            <div>
              <span className='text-sm font-medium text-gray-600'>
                Исходная строка:
              </span>
              <div className='mt-1 p-2 bg-gray-100 rounded text-sm font-mono break-all'>
                {result.input}
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-600'>Хеш:</span>
                <button
                  onClick={() => copyToClipboard(result.hash)}
                  className='text-xs text-blue-600 hover:text-blue-800'
                >
                  Копировать
                </button>
              </div>
              <div className='mt-1 p-2 bg-gray-100 rounded text-sm font-mono break-all'>
                {result.hash}
              </div>
            </div>

            <div>
              <span className='text-sm font-medium text-gray-600'>Время:</span>
              <span className='ml-2 text-sm text-gray-900'>
                {new Date(result.timestamp).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
