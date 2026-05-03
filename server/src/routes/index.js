const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const orderRoutes = require('./order');
const payRoutes = require('./pay');
const postRoutes = require('./post');
const adminRoutes = require('./admin');
const uploadRoutes = require('./upload');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/orders', orderRoutes);
router.use('/pay', payRoutes);
router.use('/posts', postRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
