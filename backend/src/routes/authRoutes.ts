import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// POST /api/auth/log - Логирование аутентификации
router.post('/log', AuthController.logAuth);

// GET /api/auth/logs - Получение логов аутентификации
router.get('/logs', AuthController.getAuthLogs);

export default router;
