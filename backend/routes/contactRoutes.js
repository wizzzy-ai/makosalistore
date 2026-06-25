import express from 'express'
import asyncHandler from 'express-async-handler'
import nodemailer from 'nodemailer'

const router = express.Router()

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { email, message } = req.body
        const supportEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM || process.env.EMAIL_USER || 'abdulmahleeque07@gmail.com'
        const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : ''

        if (!email || !message) {
            res.status(400)
            throw new Error('Please provide your email and message')
        }

        if (!process.env.EMAIL_USER || !emailPass) {
            return res.status(503).json({
                message: `Contact form email is not configured yet. Please email us directly at ${supportEmail}.`,
                supportEmail
            })
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: emailPass
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: supportEmail,
            replyTo: email,
            subject: `Urban Threads contact message from ${email}`,
            text: `Sender: ${email}\n\nMessage:\n${message}`
        })

        res.status(200).json({ message: 'Message sent successfully' })
    })
)

export default router
