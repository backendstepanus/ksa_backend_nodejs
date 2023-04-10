const express = require('express');
const app = express();
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const key = ""
const axios = require('axios')
const otpGenerator = require('otp-generator')
const environment = process.env.NODE_ENV || 'production';
const configuration = require('../knex')[environment];
const database = require('knex')(configuration);
const bodyparser = require("body-parser");
const { error } = require('console');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true,
}));

// Superadmin Function Start
function get_superadmin(req, res) {
    const getParams = req.params
    findUserID(getParams)
        .then(foundUser => {
            console.log(foundUser)
            res.status(200).json(foundUser)
        })
}

function signin_superadmin(req, res) {
    const userREG = req.body
    let user
    if (userREG.username) {
        findUsername_superadmin(userREG)
            .then(foundUser => {
                user = foundUser
                if (user == undefined) {
                    console.log(`Username ${userREG.username} is not Valid, Please use the correct Username!`)
                    res.status(500).json(`Username ${userREG.username} is not Valid, Please use the correct Username!`)
                } else {
                    checkPassword(userREG, foundUser)
                        .then(result => {
                            if (result == true) {
                                console.log(user)
                                console.log("Superadmin has been success to signin!")
                                res.status(200).json(user)
                            }
                        })
                }
            })
    }
}

// CRUD Admin & User Start //
function create_user(req, res) {
    const userREG = req.body
    let user
    if (userREG.username) {
        findUsername_user(userREG)
            .then(foundUser => {
                user = foundUser
                if (user == undefined) {
                    hashPassword(userREG.password)
                        .then((hashedPassword) => {
                            userREG.password = hashedPassword
                        })
                        .then(() => createToken())
                        .then(token => userREG.token = token)
                        .then(() => createUser(userREG))
                        .then(user => {
                            res.status(201).json({ user })
                            console.log(user)
                            console.log("User has been success to Create!");
                        })
                        .catch((err) => console.error(err))
                        .catch((err) => res.status(500).json({ error: err.message }))
                } else {
                    console.log(`Username ${userREG.username} has been used, please use a different username to continue!`)
                    res.status(500).json(`Username ${userREG.username} has been used, please use a different username to continue!`)
                }
            })
    }
}

function create_admin(req, res) {
    const userREG = req.body
    let user
    if (userREG.username) {
        findUsername_admin(userREG)
            .then(foundUser => {
                user = foundUser
                if (user == undefined) {
                    console.log("User tidak ditemukan");
                    hashPassword(userREG.password)
                        .then((hashedPassword) => {
                            userREG.password = hashedPassword
                            console.log(hashedPassword);
                        })
                        .then(() => createToken())
                        .then(token => userREG.token = token)
                        .then(() => createAdmin(userREG))
                        .then(admin => {
                            res.status(201).json({ admin })
                            console.log(admin)
                            console.log("Admin has been success to Create!");
                        })
                        .catch((err) => console.error(err))
                        .catch((err) => res.status(500).json({ error: err.message }))
                } else {
                    console.log(`Username ${userREG.username} has been used, please use a different username to continue!`)
                    res.status(500).json(`Username ${userREG.username} has been used, please use a different username to continue!`)
                }
            })
    }
}

function get_user_admin(req, res) {
    const getParams = req.params
    findByRole(getParams)
        .then(foundUser => {
            console.log(foundUser)
            res.status(200).json(foundUser)
        })
}

function getAdminUser(req, res) {
    const getParams = req.params
    findByToken(getParams)
        .then(foundUser => {
            console.log(foundUser)
            res.status(200).json(foundUser)
        })
}

function editAdminUser(req, res) {
    const getParams = req.params
    let edit
    findByToken(getParams)
        .then(foundUser => {
            edit = foundUser
            console.log(foundUser)
            if (edit) {
                updateAdminUser(req)
                    .then(updated => {
                        console.log(updated)
                        res.status(200).json(updated)
                    })
            }
        })
        .catch(err => console.log(err))
        .catch(err => res.status(500).json(err))
}

function eraseAdminUser(req, res) {
    const getParams = req.params
    let deleted
    findByToken(getParams)
        .then(foundUser => {
            deleted = foundUser
            console.log(foundUser)
            if (deleted) {
                deleteAdminUser(getParams)
                    .then(() => {
                        console.log("Data has been delete!")
                        res.status(200).json("Data has been delete!")
                    })
                    .catch(err => console.log(err))
                    .catch(err => res.status(500).json(err))
            }
        })
        .catch(err => console.log(err))
        .catch(err => res.status(500).json(err))
}

// CRUD Admin & User End //

// CRUD Store Start //
function create_store(req, res) {
    const userREG = req.body
    let store
    if (userREG.name) {
        findStore(userREG)
            .then(foundStore => {
                store = foundStore
                if (store == undefined) {
                    console.log("Nama toko tidak ditemukan");
                    createStore(userREG)
                        .then(stored => {
                            res.status(201).json({ stored })
                            console.log(stored)
                            console.log("Store has been success to Create!");
                        })
                        .catch((err) => console.error(err))
                        .catch((err) => res.status(500).json({ error: err.message }))
                } else {
                    console.log(`Store name ${userREG.name} has been used, please use a different name to continue!`)
                    res.status(500).json(`Store name ${userREG.name} has been used, please use a different name to continue!`)
                }
            })
    }
}

function getStore(req, res) {
    const getParams = req.params
    findStoreByID(getParams)
        .then(foundStore => {
            console.log(foundStore)
            res.status(200).json(foundStore)
        })
}

function getAllStore(req, res) {
    findAllStore()
        .then(foundStore => {
            console.log(foundStore)
            res.status(200).json(foundStore)
        })
}

function editStore(req, res) {
    const getParams = req.params
    let edit
    findStoreByID(getParams)
        .then(foundStore => {
            edit = foundStore
            console.log(foundStore)
            if (edit) {
                updateStore(req)
                    .then(updated => {
                        console.log(updated)
                        res.status(200).json(updated)
                    })
            }
        })
        .catch(err => console.log(err))
        .catch(err => res.status(500).json(err))
}

function eraseStore(req, res) {
    const getParams = req.params
    let deleted
    findStoreByID(getParams)
        .then(foundUser => {
            deleted = foundUser
            console.log(foundUser)
            if (deleted) {
                deleteStore(getParams)
                    .then(() => {
                        console.log("Data has been delete!")
                        res.status(200).json("Data has been delete!")
                    })
                    .catch(err => console.log(err))
                    .catch(err => res.status(500).json(err))
            }
        })
        .catch(err => console.log(err))
        .catch(err => res.status(500).json(err))
}

// CRUD Store End //

// CRUD Role Start //
function create_role(req, res) {
    const userREG = req.body
    let role
    if (userREG.role) {
        findRole(userREG)
            .then(foundRole => {
                role = foundRole
                if (role == undefined) {
                    console.log("Nama toko tidak ditemukan");
                    createStore(userREG)
                        .then(Role => {
                            res.status(201).json({ Role })
                            console.log(Role)
                            console.log("Role has been success to Create!");
                        })
                        .catch((err) => console.error(err))
                        .catch((err) => res.status(500).json({ error: err.message }))
                } else {
                    console.log(`Store name ${userREG.name} has been used, please use a different name to continue!`)
                    res.status(500).json(`Store name ${userREG.name} has been used, please use a different name to continue!`)
                }
            })
    }
}

function getRole(req, res) {
    const getParams = req.params
    findRoleByID(getParams)
        .then(foundRole => {
            console.log(foundRole)
            res.status(200).json(foundRole)
        })
}

function getAllRole(req, res) {
    findAllRole()
        .then(foundRole => {
            console.log(foundRole)
            res.status(200).json(foundRole)
        })
}

function editRole(req, res) {
    const getParams = req.params
    let edit
    findByToken(getParams)
        .then(foundStore => {
            edit = foundStore
            console.log(foundStore)
            if (edit) {
                updateAdminUser(req)
                    .then(updated => {
                        console.log(updated)
                        res.status(200).json(updated)
                    })
            }
        })
        .catch(err => console.log(err))
        .catch(err => res.status(500).json(err))
}

function eraseStore(req, res) {
    const getParams = req.params
    let deleted
    findStoreByID(getParams)
        .then(foundUser => {
            deleted = foundUser
            console.log(foundUser)
            if (deleted) {
                deleteAdminUser(getParams)
                    .then(() => {
                        console.log("Data has been delete!")
                        res.status(200).json("Data has been delete!")
                    })
                    .catch(err => console.log(err))
                    .catch(err => res.status(500).json(err))
            }
        })
        .catch(err => console.log(err))
        .catch(err => res.status(500).json(err))
}

// CRUD Role End //

// Superadmin Function End

// Hashing Fuction Start
const hashPassword = (password) => {
    return new Promise((resolve, reject) =>
        bcrypt.hash(password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash.toString('base64'))
        })
    )
}

const SU_hashPassword = (request) => {
    const superadmin = request.body
    return new Promise((resolve, reject) =>
        bcrypt.hash(superadmin.password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash.toString('base64'))
            console.log(hash)
        })
    )
}

// Hashing Function End

// Create Function Start
const createUser = (user) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO admin_user(id,username, password,role,status, token) VALUES (?, ?, ?, ?, ?,?) RETURNING id,username,password,role,status, token", [id, user.username, user.password, user.role, user.status, user.token]
        )
        .then((data) => data.rows[0])
}

const createAdmin = (user) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO admin_user(id,username, password,role,status, token) VALUES (?, ?, ?, ?, ?, ?) RETURNING id,username,password,role,status, token", [id, user.username, user.password, user.role, user.status, user.token]
        )
        .then((data) => data.rows[0])
}

const createToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, data) => {
            err ? reject(err) : resolve(data.toString('base64'))
        })
    })
}

const createStore = (userREG) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO store(id,name, address,admin_store) VALUES (?, ?, ?, ?) RETURNING id,name, address,admin_store", [id, userREG.name, userREG.address, userREG.admin_store]
        )
        .then((data) => data.rows[0])
}

// Create Function End

// Update Function Start
const updateAdminUser = (req) => {
    const getparams = req.params
    const getupdate = req.body
    return database.raw(
            "UPDATE admin_user SET username = ?,store = ?,role = ?,status = ? WHERE token = ? RETURNING id,username, store,role,status,token", [getupdate.username, getupdate.store, getupdate.role, getupdate.status, getparams.token]
        )
        .then((data) => data.rows[0])
}

const updateStore = (req) => {
    const getparams = req.params
    const getupdate = req.body
    return database.raw(
            "UPDATE store SET name = ?,address = ?,admin_store = ? WHERE token = ? RETURNING id,name,address,admin_store,token", [getupdate.name, getupdate.address, getupdate.admin_store, getparams.token]
        )
        .then((data) => data.rows[0])
}

const updateUserPassword = (user_reset, hashedPassword) => {
    return database.raw("UPDATE admin_user SET password = ? WHERE id = ? RETURNING id, username, password", [hashedPassword, user_reset.id])
        .then((data) => data.rows[0])
}

const updateUserToken = (token, edit_user) => {
    return database.raw("UPDATE admin_user SET token = ? WHERE id = ? RETURNING id, username, token", [token, edit_user.id])
        .then((data) => data.rows[0])
}

const updateStatus = (req, res) => {
    const param = req.params
    const status = req.body
    database.raw("UPDATE admin_user SET status = ? where token = ? RETURNING token,status", [status.status, param.token])
        .then((data) => {
            if (data) {
                console.log(data.rows)
                console.log("status has been changed!")
                res.status(200).json(data.rows)
            }
        })
        .catch(error => console.log(error))
        .catch(error => res.status(500).json(error))

}

// Update Function End

// Delete Function Start
const deleteAdminUser = (getParams) => {
    return database.raw(
            "DELETE FROM admin_user WHERE token = ?", [getParams.token]
        )
        .then((data) => data.rows[0])
}

const deleteStore = (getParams) => {
    return database.raw(
            "DELETE FROM admin_user WHERE id = ?", [getParams.id]
        )
        .then((data) => data.rows[0])
}

// Delete Function End

//Find Function Start
function findUserID(getParams) {
    return database.raw("SELECT * FROM superadmin WHERE id = ?", [getParams.id])
        .then((data) => data.rows[0])
}

function findByID(getParams) {
    return database.raw("SELECT * FROM admin_user WHERE id = ?", [getParams.id])
        .then((data) => data.rows[0])
}

function findUsername_superadmin(userREG) {
    return database.raw("SELECT * FROM superadmin WHERE username = ?", [userREG.username])
        .then((data) => data.rows[0])
}

function findUsername_user(userREG) {
    return database.raw("SELECT * FROM admin_user WHERE username = ?", [userREG.username])
        .then((data) => data.rows[0])
}

function findUsername_admin(userREG) {
    return database.raw("SELECT * FROM admin_user WHERE username = ?", [userREG.username])
        .then((data) => data.rows[0])
}

function findByRole(getParams) {
    return database.raw("SELECT * FROM admin_user WHERE role = ?", [getParams.role])
        .then((data) => data.rows)
}

function findByToken(getParams) {
    return database.raw("SELECT * FROM admin_user WHERE token = ?", [getParams.token])
        .then((data) => data.rows)
}

function findAllStore() {
    return database.raw("SELECT * FROM store")
        .then((data) => data.rows)
}

function findStore(userREG) {
    return database.raw("SELECT * FROM store WHERE name = ?", [userREG.name])
        .then((data) => data.rows[0])
}

function findStoreByID(getParams) {
    return database.raw("SELECT * FROM store WHERE id = ?", [getParams.id])
        .then((data) => data.rows[0])
}

// Find Function End

// Check Function Start
const checkPassword = (userREG, foundUser) => {
    return new Promise((resolve, reject) =>
        bcrypt.compare(userREG.password, foundUser.password, (err, response) => {
            if (err) {
                reject(err)
            } else if (response) {
                resolve(response)
            } else {
                console.log({ message: "Password its Wrong" })
            }
        })
    )
}

// function findAllRole() {
//     return database.raw("SELECT * FROM roles")
//         .then((data) => data.rows)
// }

// function findRole(userREG) {
//     return database.raw("SELECT * FROM role WHERE role_name = ?", [userREG.role])
//         .then((data) => data.rows[0])
// }

// function findRoleByID(getParams) {
//     return database.raw("SELECT * FROM role WHERE id = ?", [getParams.id])
//         .then((data) => data.rows[0])
// }

// Check Function End
module.exports = {
    get_superadmin,
    signin_superadmin,
    hashPassword,
    SU_hashPassword,
    create_user,
    create_admin,
    get_user_admin,
    updateStatus,
    getAdminUser,
    editAdminUser,
    eraseAdminUser,
    create_store,
    getStore,
    getAllStore,
    editStore,
    eraseStore,
}