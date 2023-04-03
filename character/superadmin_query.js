const express = require('express');
const app = express();
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
        findUsername(userREG)
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
// Superadmin Function End

//Find Function Start
function findUserID(getParams) {
    return database.raw("SELECT * FROM superadmin WHERE id = ?", [getParams.id])
        .then((data) => data.rows[0])
}

function findUsername(userREG) {
    return database.raw("SELECT * FROM superadmin WHERE username = ?", [userREG.username])
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
    hashPassword
}