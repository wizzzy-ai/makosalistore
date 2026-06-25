import path from 'path'
import fs from 'fs'
import express from 'express'
import multer from 'multer'
import { protect } from '../middleware/authMiddleware.js'


const router = express.Router()

const uploadDirectory = path.join(path.resolve(), 'uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
        return
    }

    cb(new Error('Images only'))
}

const upload = multer({ storage, fileFilter: checkFileType })

router.post('/', protect, upload.single('image'), (req, res) => {
    res.send(`/uploads/${req.file.filename}`)
})


export default router
