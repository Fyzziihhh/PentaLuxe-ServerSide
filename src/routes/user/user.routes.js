import express from 'express'
import { registerUser, VerifyOtp } from '../../controllers/user.controllers.js'
const router =express.Router()


router.post('/register',registerUser)
router.post('/otp-verify',VerifyOtp)


export default router
