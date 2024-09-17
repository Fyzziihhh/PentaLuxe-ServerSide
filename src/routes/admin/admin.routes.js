import express from 'express';
import { 
  adminLogin, 
  getCategories, 
  deleteCategory, 
  uploadFilesAndAddCategory, 
  adminLogOut
} from '../../controllers/admin/admin.controller.js';
import { uploader } from '../../middlewares/multer.middlerware.js';
import { 
    deleteProduct,
  getAllProducts, 
  singleProudct, 
  updateProduct, 
  uploadFilesAndAddProducts 
} from '../../controllers/admin/admin.product.controller.js';
import { 
  getAllUser, 
  updateUserStatus 
} from '../../controllers/admin/admin.user.controller.js'; 
import adminAuthMiddleware from '../../middlewares/adminSession.middleware.js';

const router = express.Router();

// Admin routes
router.post('/login', adminLogin);
router.post('/logout', adminAuthMiddleware, adminLogOut);

// Category routes
router.post('/upload-category', adminAuthMiddleware, uploader.single('categoryImage'), uploadFilesAndAddCategory);
router.get('/categories', adminAuthMiddleware, getCategories);
router.delete('/categories/:id', adminAuthMiddleware, deleteCategory);

// Product routes
router.post('/products', adminAuthMiddleware, uploader.any(), uploadFilesAndAddProducts);
router.get('/products', adminAuthMiddleware, getAllProducts);
router.delete('/products/:id',adminAuthMiddleware,deleteProduct)
router.get('/products/:id',singleProudct)
router.put('/products/:id',uploader.any(),updateProduct)

// Customer routes
router.get('/customers', adminAuthMiddleware, getAllUser);


// Status update route
router.patch('/statusUpdate', adminAuthMiddleware, updateUserStatus);

export default router;
