import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
import { UserRoleModel } from '../models/UserRole';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    external_id: string;
    provider: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized - No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    
    // TODO: Добавить JWT декодирование и получение user_id из токена
    // Пока что используем заглушку для проверки роли
    
    // Временная проверка - в реальном проекте нужно декодировать JWT
    const user = await UserModel.findById(1); // Заглушка
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized - User not found' });
      return;
    }

    // Проверяем роль пользователя через таблицу user_role
    const isAdmin = await UserRoleModel.isAdmin(user.id!);
    
    if (!isAdmin) {
      res.status(403).json({ error: 'Forbidden - Admin access required' });
      return;
    }

    req.user = {
      id: user.id!,
      external_id: user.external_id,
      provider: user.provider,
      name: user.name,
      email: user.email,
      role: 'admin'
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 