const express = require('express');
const router = express.Router();
const { adminAuthMiddleware, requireRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);

router.use(adminAuthMiddleware);

router.get('/dashboard', adminController.getDashboard);

router.get('/users', requireRole('super_admin', 'customer_service'), adminController.getUsers);
router.put('/users/:id/status', requireRole('super_admin'), adminController.updateUserStatus);

router.get('/keepers', requireRole('super_admin', 'customer_service'), adminController.getKeeperApplications);
router.put('/keepers/:id/review', requireRole('super_admin', 'customer_service'), adminController.reviewKeeper);

router.get('/orders', requireRole('super_admin', 'finance', 'customer_service'), adminController.getOrders);

router.get('/posts', requireRole('super_admin', 'customer_service'), adminController.getPosts);
router.put('/posts/:id/review', requireRole('super_admin', 'customer_service'), adminController.reviewPost);

router.get('/services', requireRole('super_admin', 'customer_service'), adminController.getServices);
router.post('/services', requireRole('super_admin'), adminController.createService);
router.put('/services/:id', requireRole('super_admin'), adminController.updateService);
router.delete('/services/:id', requireRole('super_admin'), adminController.deleteService);

router.get('/service-categories', requireRole('super_admin', 'customer_service'), adminController.getServiceCategories);
router.post('/service-categories', requireRole('super_admin'), adminController.createServiceCategory);
router.put('/service-categories/:id', requireRole('super_admin'), adminController.updateServiceCategory);
router.delete('/service-categories/:id', requireRole('super_admin'), adminController.deleteServiceCategory);

router.get('/keeper-levels', requireRole('super_admin'), adminController.getKeeperLevels);
router.post('/keeper-levels', requireRole('super_admin'), adminController.createKeeperLevel);
router.put('/keeper-levels/:id', requireRole('super_admin'), adminController.updateKeeperLevel);
router.delete('/keeper-levels/:id', requireRole('super_admin'), adminController.deleteKeeperLevel);

router.get('/coupons', requireRole('super_admin', 'finance'), adminController.getCoupons);
router.post('/coupons', requireRole('super_admin'), adminController.createCoupon);
router.put('/coupons/:id', requireRole('super_admin'), adminController.updateCoupon);
router.delete('/coupons/:id', requireRole('super_admin'), adminController.deleteCoupon);

router.get('/conversations', requireRole('super_admin', 'customer_service'), adminController.getConversations);
router.delete('/conversations/:id', requireRole('super_admin', 'customer_service'), adminController.deleteConversation);

router.get('/auto-replies', requireRole('super_admin'), adminController.getAutoReplies);
router.post('/auto-replies', requireRole('super_admin'), adminController.createAutoReply);
router.put('/auto-replies/:id', requireRole('super_admin'), adminController.updateAutoReply);
router.delete('/auto-replies/:id', requireRole('super_admin'), adminController.deleteAutoReply);

router.get('/wechat-menu', requireRole('super_admin'), adminController.getWechatMenu);
router.post('/wechat-menu', requireRole('super_admin'), adminController.saveWechatMenu);

router.get('/common-words', requireRole('super_admin', 'customer_service'), adminController.getCommonWords);
router.post('/common-words', requireRole('super_admin'), adminController.createCommonWord);
router.put('/common-words/:id', requireRole('super_admin'), adminController.updateCommonWord);
router.delete('/common-words/:id', requireRole('super_admin'), adminController.deleteCommonWord);

router.get('/faq', requireRole('super_admin', 'customer_service'), adminController.getFAQ);
router.post('/faq', requireRole('super_admin'), adminController.createFAQ);
router.put('/faq/:id', requireRole('super_admin'), adminController.updateFAQ);
router.delete('/faq/:id', requireRole('super_admin'), adminController.deleteFAQ);

router.get('/team', requireRole('super_admin'), adminController.getTeam);
router.post('/team', requireRole('super_admin'), adminController.createTeamMember);
router.put('/team/:id', requireRole('super_admin'), adminController.updateTeamMember);
router.delete('/team/:id', requireRole('super_admin'), adminController.deleteTeamMember);

router.get('/statistics', requireRole('super_admin', 'finance'), adminController.getStatistics);

router.get('/system-settings', requireRole('super_admin'), adminController.getSystemSettings);
router.post('/system-settings', requireRole('super_admin'), adminController.saveSystemSettings);

module.exports = router;