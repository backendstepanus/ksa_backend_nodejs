const express = require('express');
const router = express.Router();

// const superadmin = require('../character/superadmin_query');

const role = require('../action/roles');
const toko = require('../action/store');
const pengguna = require('../action/pengguna');
const auth = require('../action/auth');

// Superadmin API
// router.post('/hash_password', superadmin.SU_hashPassword)
// router.get('/get_superadmin/:id', superadmin.get_superadmin)
// router.post('/signin_superadmin', superadmin.signin_superadmin)
// router.post('/create_admin', superadmin.create_admin)
// router.post('/create_user', superadmin.create_user)
// router.get('/get_user_admin/:role', superadmin.get_user_admin)
// router.patch('/update_status/:token', superadmin.updateStatus)
// router.get('/getDataByToken/:token', superadmin.getAdminUser)
// router.patch('/editDataByToken/:token', superadmin.editAdminUser)
// router.delete('/deleteDataByToken/:token', superadmin.eraseAdminUser)
// router.post('/create_store', superadmin.create_store)
// router.get('/get_store/:id', superadmin.getStore)
// router.get('/get_Allstore', superadmin.getAllStore)
// router.patch('/editStoreByID/:id', superadmin.editStore)
// router.delete('/deleteStoreByID/:id', superadmin.eraseStore)

//auth api


//pengguna api
router.get('/getAllPengguna', pengguna.getAllPengguna)
router.post('/postPengguna', pengguna.createPengguna)

//toko api
router.get('/getAllToko', toko.getAllToko)
router.get('/getMasterToko', toko.getMasterToko)
router.post('/postToko', toko.createToko)
router.patch('/updateToko/:id', toko.updateToko)
router.delete('/deleteToko/:id', toko.deleteToko)

//role api
router.get('/getAllRole', role.getAllRole)
router.post('/postRole', role.createRole)
router.patch('/updateRole/:id', role.updateRole)
router.delete('/deleteRole/:id', role.deleteRole)

// Admin & User API
module.exports = router;