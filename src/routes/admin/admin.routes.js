import express from 'express'
const router =express.Router();
import { adminLogin, getCategories, uploadFile ,deleteCategory} from '../../controllers/admin/admin.controller.js';
import multer from 'multer';

 const uploader= multer({
    storage:multer.diskStorage({}),
    limits:{fileSize:500000}
  });

router.post('/login',adminLogin)
router.post('/upload-category',uploader.single('categoryImage'), uploadFile)
router.get('/categories',getCategories)
router.delete('/categories/:id',deleteCategory)

export default router