import express from 'express'
const router = express.Router()
import { addorderitems, GetMyOrders, getOrderById, GetOrders, updateOrderToPaid,updateOrderToDelivered, updateOrderDelivery, updateOrderAdminStatus, deleteOrder } from '../controlers/orderControler.js'
import {protect, admin} from '../middleware/authMiddleware.js'


router.route('/').post(protect,addorderitems).get(protect, admin, GetOrders)

router.route('/myorders').get(protect,GetMyOrders) 

router.route('/:id').get(protect,getOrderById).delete(protect, admin, deleteOrder) 
router.route('/:id/pay').put(protect,updateOrderToPaid) 

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered) 
router.route('/:id/delivery').put(protect, admin, updateOrderDelivery)
router.route('/:id/admin-status').put(protect, admin, updateOrderAdminStatus)





export default router
