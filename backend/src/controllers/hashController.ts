import { Request, Response } from 'express';
import crypto from 'crypto';
import { HashRequestModel, HashRequest } from '../models/HashRequest.js';
import { UserModel } from '../models/User';

export interface HashResult {
  algorithm: string;
  input: string;
  hash: string;
  timestamp: string;
}

export class HashController {
  static async hashString(req: Request, res: Response): Promise<void> {
    try {
      const { input, algorithm } = req.body;
      const userEmail = req.query.email as string;

      // Валидация входных данных
      if (!input || typeof input !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Input string is required'
        });
        return;
      }

      if (!algorithm || !['md5', 'sha1', 'sha256'].includes(algorithm)) {
        res.status(400).json({
          success: false,
          error: 'Valid algorithm (md5, sha1, sha256) is required'
        });
        return;
      }

      // Генерируем хеш
      let hash: string;
      switch (algorithm) {
        case 'md5':
          hash = crypto.createHash('md5').update(input).digest('hex');
          break;
        case 'sha1':
          hash = crypto.createHash('sha1').update(input).digest('hex');
          break;
        case 'sha256':
          hash = crypto.createHash('sha256').update(input).digest('hex');
          break;
        default:
          res.status(400).json({
            success: false,
            error: 'Unsupported algorithm'
          });
          return;
      }

      // Получаем информацию о пользователе (если авторизован)
      let userId: number | undefined;
      if (userEmail) {
        const user = await UserModel.findByEmail(userEmail);
        userId = user?.id;
      }

      // Получаем IP адрес и User-Agent
      const ipAddress = req.ip || req.connection.remoteAddress || (req.headers['x-forwarded-for'] as string);
      const userAgent = req.headers['user-agent'];

      // Сохраняем запрос в базу данных для аудита
      const hashRequest: HashRequest = {
        user_id: userId,
        algorithm_id: await HashRequestModel.getAlgorithmId(algorithm),
        input_string: input,
        hash_result: hash,
        ip_address: ipAddress,
        user_agent: userAgent,
      };

      await HashRequestModel.create(hashRequest);

      const result: HashResult = {
        algorithm,
        input,
        hash,
        timestamp: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        result
      });
    } catch (error) {
      console.error('Error in hashString:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getHashHistory(req: Request, res: Response): Promise<void> {
    try {
      const userEmail = req.query.email as string;
      const { limit = 50 } = req.query;

      if (!userEmail) {
        res.status(401).json({
          success: false,
          error: 'User email is required'
        });
        return;
      }

      const user = await UserModel.findByEmail(userEmail);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const history = await HashRequestModel.findByUserId(user.id!, Number(limit));

      res.status(200).json({
        success: true,
        history
      });
    } catch (error) {
      console.error('Error in getHashHistory:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 