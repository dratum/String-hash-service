'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from 'app/lib/authOptions';

export interface HashResult {
  algorithm: string;
  input: string;
  hash: string;
  timestamp: string;
}

export interface HashHistoryItem {
  id: number;
  algorithm_name: string;
  input_string: string;
  hash_result: string;
  created_at: string;
}

export async function hashString(
  input: string,
  algorithm: 'md5' | 'sha1' | 'sha256'
): Promise<{
  success: boolean;
  result?: HashResult;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, error: 'Не авторизован' };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hash?email=${encodeURIComponent(session.user.email || '')}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          algorithm,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Ошибка хеширования' };
    }

    const data = await response.json();
    return { success: true, result: data.result };
  } catch (error) {
    console.error('Error hashing string:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}

export async function getHashHistory(): Promise<{
  success: boolean;
  history?: HashHistoryItem[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, error: 'Не авторизован' };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hash/history?email=${encodeURIComponent(session.user.email || '')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Ошибка получения истории',
      };
    }

    const data = await response.json();
    return { success: true, history: data.history };
  } catch (error) {
    console.error('Error fetching hash history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}
