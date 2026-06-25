import express from 'express'
const router = express.Router()
import { getDashboardStats, getRecentActivities } from '../controlers/adminControler.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// All routes are protected and require admin access
router.use(protect, admin)

// @route GET /api/admin/statistics
// @desc Get dashboard statistics
router.get('/statistics', getDashboardStats)

// @route GET /api/admin/activities
// @desc Get recent activities
router.get('/activities', getRecentActivities)

export default router