const express = require('express');
const router = express.Router();
const superadmin = require('../character/superadmin_query');

// Superadmin API
router.get('/get_superadmin/:id', superadmin.get_superadmin)
router.post('/signin_superadmin', superadmin.signin_superadmin)
router.post('/create_admin', superadmin.create_admin)
router.post('/create_user', superadmin.create_user)
router.get('/get_user_admin/:role', superadmin.get_user_admin)
router.patch('/update_status/:token', superadmin.updateStatus)
router.get('/getDataByToken/:token', superadmin.getAdminUser)
router.patch('/editDataByToken/:token', superadmin.editAdminUser)
router.delete('/deleteDataByToken/:token', superadmin.eraseAdminUser)
router.post('/create_store', superadmin.create_store)

// Admin & User API
module.exports = router;