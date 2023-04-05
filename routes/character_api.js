const express = require('express');
const router = express.Router();
const superadmin = require('../character/superadmin_query');

router.get('/get_superadmin/:id', superadmin.get_superadmin)
router.post('/signin_superadmin', superadmin.signin_superadmin)
router.post('/create_admin', superadmin.create_admin)

module.exports = router;