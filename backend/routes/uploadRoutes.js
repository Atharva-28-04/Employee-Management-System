import express from 'express';
import multer from 'multer';
import prisma from '../config/prismaClient.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage: storage, limits: { files: 5 } });

router.post('/', upload.array('documents', 5), async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded.' });

    for (const file of req.files) {
      await prisma.employeeDocument.create({
        data: {
          employee_id: parseInt(employeeId),
          image_url: `/uploads/${file.filename}`
        }
      });
    }
    res.status(200).json({ message: 'Files uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;