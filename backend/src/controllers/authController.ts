import { Request, Response } from 'express';
import { UserModel, User } from '../models/User';
import { AuthLogModel, AuthLog } from '../models/AuthLog';

export class AuthController {
  static async logAuth(req: Request, res: Response): Promise<void> {
    try {
      const {
        external_id,
        provider,
        email,
        display_name,
        avatar_url,
        action,
        success,
      } = req.body;

      // Получаем IP адрес и User-Agent
      const ip_address =
        req.ip ||
        req.connection.remoteAddress ||
        (req.headers['x-forwarded-for'] as string);
      const user_agent = req.headers['user-agent'];

      // Ищем существующего пользователя
      let user = await UserModel.findByExternalId(external_id, provider);

      if (!user) {
        // Создаем нового пользователя
        const userData: User = {
          external_id,
          provider,
          name: display_name,
          email,
          avatar_url,
          is_active: true,
        };

        user = await UserModel.create(userData);
      } else {
        // Обновляем существующего пользователя
        const updateData: Partial<User> = {
          name: display_name,
          email,
          avatar_url,
        };

        user = (await UserModel.update(user.id!, updateData)) || user;
      }

      // Создаем лог аутентификации
      const logData: AuthLog = {
        user_id: user.id,
        action: action || 'login',
        provider,
        ip_address,
        user_agent,
        success: success !== false,
      };

      await AuthLogModel.create(logData);

      res.status(200).json({
        success: true,
        message: 'Auth log created successfully',
        user: {
          id: user.id,
          external_id: user.external_id,
          provider: user.provider,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Error in logAuth:', error);

      // Логируем ошибку
      try {
        const logData: AuthLog = {
          action: req.body.action || 'login',
          provider: req.body.provider,
          ip_address:
            req.ip ||
            req.connection.remoteAddress ||
            (req.headers['x-forwarded-for'] as string),
          user_agent: req.headers['user-agent'],
          success: false,
          error_message:
            error instanceof Error ? error.message : 'Unknown error',
        };

        await AuthLogModel.create(logData);
      } catch (logError) {
        console.error('Error logging auth error:', logError);
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getAuthLogs(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, limit = 100 } = req.query;

      let logs: AuthLog[];

      if (user_id) {
        logs = await AuthLogModel.findByUserId(Number(user_id));
      } else {
        logs = await AuthLogModel.findRecent(Number(limit));
      }

      res.status(200).json({
        success: true,
        logs,
      });
    } catch (error) {
      console.error('Error in getAuthLogs:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
