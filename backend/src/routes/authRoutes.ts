import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/log - Логирование аутентификации
router.post('/log', AuthController.logAuth);

// GET /api/auth/logs - Получение логов аутентификации (только для админов)
router.get('/logs', requireAdmin, AuthController.getAuthLogs);

export default router;
