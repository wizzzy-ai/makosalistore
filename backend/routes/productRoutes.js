import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createproductreview,
  getProductReviewsAdmin,
  setProductReviewApproval,
  deleteProductReview,
} from '../controlers/productControler.js'
import { protect, admin } from '../middleware/authMiddleware.js'


router.route('/').get(getProducts).post(protect, admin, createProduct)

router.route('/:id/reviews').post(protect,createproductreview)
router.route('/:id/reviews/all').get(protect, admin, getProductReviewsAdmin)
router.route('/:id/reviews/:reviewId/approve').put(protect, admin, setProductReviewApproval)
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteProductReview)

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)




export default router
