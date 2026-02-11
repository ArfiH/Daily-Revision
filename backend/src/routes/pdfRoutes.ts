import { Router } from 'express';
import {
  rebuildScheduleHandler,
  getTodaySchedule,
  getScheduleRange,
  updateScheduleStatus,
} from '../controllers/scheduleController';

const router = Router();

router.post('/rebuild', rebuildScheduleHandler);
router.get('/today', getTodaySchedule);
router.get('/range', getScheduleRange);
router.patch('/:id', updateScheduleStatus);

export default router;