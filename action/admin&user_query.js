const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const key = ""
const axios = require('axios')
const otpGenerator = require('otp-generator')
const environment = process.env.NODE_ENV || 'production';
const configuration = require('../knex')[environment];
const database = require('knex')(configuration);
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true,
}));

// Admin Function Start
function get_admin(req, res) {
    const getParams = req.params
    findAdminID(getParams)
        .then(foundUser => {
            console.log(foundUser)
            res.status(200).json(foundUser)
        })
}

function signin_admin(req, res) {
    const userREG = req.body
    let user
    if (userREG.username) {
        findUsername_admin(userREG)
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
// Admin Function End

// User Function Start
function get_user(req, res) {
    const getParams = req.params
    findUserID(getParams)
        .then(foundUser => {
            console.log(foundUser)
            res.status(200).json(foundUser)
        })
}

function signin_user(req, res) {
    const userREG = req.body
    let user
    if (userREG.username) {
        findUsername_user(userREG)
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
// User Function End

//Find Function Start
function findAdminID(getParams) {
    return database.raw("SELECT role = admin FROM admin_user WHERE id = ?", [getParams.id])
        .then((data) => data.rows[0])
}

function findUserID(getParams) {
    return database.raw("SELECT role = user FROM admin_user WHERE id = ?", [getParams.id])
        .then((data) => data.rows[0])
}

function findUsername_admin(userREG) {
    return database.raw("SELECT role = admin FROM admin_user WHERE username = ?", [userREG.username])
        .then((data) => data.rows[0])
}

function findUsername_user(userREG) {
    return database.raw("SELECT role = user FROM admin_user WHERE username = ?", [userREG.username])
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
    get_admin,
    signin_admin,
    get_user,
    signin_user
}