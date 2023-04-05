const express = require('express');
const app = express();
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const key = ""
const axios = require('axios')
const otpGenerator = require('otp-generator')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knex')[environment];
const database = require('knex')(configuration);
const bodyparser = require("body-parser");

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
// Superadmin Function End

// Hashing Fuction Start
const hashPassword = (password) => {
    return new Promise((resolve, reject) =>
        bcrypt.hash(password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash.toString('base64'))
        })
    )
}

// Hashing Function End

// Create Function Start
const createUser = (user) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO admin_user(id,username, password, token) VALUES (?, ?, ?, ?) RETURNING id,username,password, token", [id, user.username, user.password, user.token]
        )
        .then((data) => data.rows[0])
}

const createAdmin = (user) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO admin_user(id,username, password, token) VALUES (?, ?, ?, ?) RETURNING id,username,password, token", [id, user.username, user.password, user.token]
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

// Create Function End

// Update Function Start
const updateUser = (request) => {
    const getparams = request.params
    const user = request.body
    return database.raw(
            "UPDATE admin_user SET username = ?,password = ? WHERE id = ? RETURNING id,username, password", [user.username, user.password, getparams.id]
        )
        .then((data) => data.rows[0])
}

const updateAdmin = (request) => {
    const getparams = request.params
    const user = request.body
    return database.raw(
            "UPDATE admin_user SET username = ?,password = ? WHERE id = ? RETURNING id,username, password", [user.username, user.password, getparams.id]
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

// Update Function End

//Find Function Start
function findUserID(getParams) {
    return database.raw("SELECT * FROM superadmin WHERE id = ?", [getParams.id])
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

// Check Function End
module.exports = {
    get_superadmin,
    signin_superadmin,
    hashPassword,
    create_user,
    create_admin
}