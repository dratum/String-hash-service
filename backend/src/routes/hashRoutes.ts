import { Router } from 'express';
import { HashController } from '../controllers/hashController';

const router = Router();

// POST /api/hash - Хеширование строки
router.post('/', HashController.hashString);

// GET /api/hash/history - Получение истории хеширования пользователя
router.get('/history', HashController.getHashHistory);

export default router; 