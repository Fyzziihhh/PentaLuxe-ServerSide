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
  searchProducts, 
  singleProudct, 
  updateProduct, 
  uploadFilesAndAddProducts 
} from '../../controllers/admin/admin.product.controller.js';
import { 
  getAllUser, 
  searchUsers, 
  updateUserStatus 
} from '../../controllers/admin/admin.user.controller.js'; 
import adminAuthMiddleware from '../../middlewares/adminSession.middleware.js';
import { changeOrderStatus, getAllOrders } from '../../controllers/admin/admin.order.controller.js';
import { createCoupon, deleteCoupon, getAllCoupons } from '../../controllers/admin/admin.coupon.controller.js';

const router = express.Router();

// Admin routes
router.post('/login', adminLogin);
router.post('/logout', adminAuthMiddleware, adminLogOut);

// Category routes
router.post('/upload-category', adminAuthMiddleware, uploader.single('categoryImage'), uploadFilesAndAddCategory);
router.get('/categories', adminAuthMiddleware,getCategories);
router.delete('/categories/:id', adminAuthMiddleware, deleteCategory);

// Product routes
router.post('/products', uploader.any(), uploadFilesAndAddProducts);
router.get('/products', adminAuthMiddleware, getAllProducts);
router.delete('/products/:id',adminAuthMiddleware,deleteProduct)
router.get('/products/:id',singleProudct)
router.put('/products/:id',uploader.any(),updateProduct)
router.post('/search-product',searchProducts)

// Customer routes
router.get('/customers', adminAuthMiddleware, getAllUser);
router.post('/search-user',searchUsers)


// Status update route
router.patch('/statusUpdate', adminAuthMiddleware, updateUserStatus);

router.get('/orders',getAllOrders)
router.patch('/orders',changeOrderStatus)


router.post('/coupon',createCoupon)
router.get('/coupon',getAllCoupons)
router.delete('/coupon/:id',deleteCoupon)

export default router;
