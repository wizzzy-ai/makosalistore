import express from 'express'
const router = express.Router()
import {authUser, registerUser, getUserProfile, updateUserProfile,getUsers, deleteUser, getUserByID, updateUser } from '../controlers/userControler.js'
import { protect } from '../middleware/authMiddleware.js'


router.route('/').post(registerUser).get(protect,getUsers)


router.post('/login', authUser)

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile )

router.route('/:id').delete(protect,deleteUser).get(protect,getUserByID).put(protect,updateUser)



export default router