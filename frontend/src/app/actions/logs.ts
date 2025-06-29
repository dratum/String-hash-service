'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export interface AuthLog {
  id: number;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  action: string;
  provider?: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  created_at: string;
}

export async function getAuthLogs(): Promise<{
  success: boolean;
  logs?: AuthLog[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: 'Не авторизован' };
    }

    // Проверяем роль пользователя из сессии
    if (session.user.role !== 'admin') {
      return { success: false, error: 'Доступ запрещен. Требуются права администратора' };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logs?email=${encodeURIComponent(session.user.email || '')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Ошибка получения логов' };
    }

    const data = await response.json();
    return { success: true, logs: data.logs };
  } catch (error) {
    console.error('Error fetching auth logs:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
    };
  }
}
