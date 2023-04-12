const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const bodyparser = require("body-parser");
const validator = require('../helpers/validate');
const models = require('../models/pengguna');
const models2 = require('../models/account');
const { isEmpty, isUndefined, findLastIndex } = require('lodash');
const { existsSync } = require('fs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true,
}));


//action
const getAllPengguna = (request, response) => {
    models.queryAllPengguna()
    .then(data => {
        console.log(data)
        response.status(200).json({
            "message" : "Data Pengguna",
            "data" : data,
            "status" : 200
        })
    })
    .catch(error => console.log(error))
    .catch(error => response.status(500).json(error))
}

const createPengguna = async (request, response) => {
    const body = request.body;
    let data
    const validationRule = {
        "nama_pengguna" : "required|string",
        "toko_id" : "required|string",
        "role_id" : "required|string",
        "status" : "required"
    }

    await validator(body, validationRule, {}, (err, status) => {
        if (!status) {
            response.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            models.queryfindPengguna(body)
            .then(value => {
                data = value
                if(data === undefined)
                {
                    models.queryInsertPengguna(body)
                    .then( async (data) => {
                        if(data)
                        {
                            const username = data.nama_pengguna.replace(/\W+/g, '').toLowerCase()
                            const salt = await bcrypt.genSalt(10)
                            const password = await bcrypt.hash(username, salt)
                            const penggunaid = data.id
                            models2.queryInsertAccount(username, password, penggunaid)
                            .then(data2 => {
                                if(data2)
                                {
                                    console.log(data2)
                                    console.log("Data Pengguna Berhasil ditambah");
                                    return response.status(200).json({
                                        "message" : "Data Pengguna Berhasil ditambah",
                                        "data" : data2,
                                        "status" : 200
                                    })
                                }
                                else{
                                    return response.status(400).json({
                                        "message" : "Gagal Membuat Akun untuk Data Pengguna",
                                        "status":400
                                    })
                                }
                            })
                            .catch(error => console.log(error))
                            .catch(error => response.status(500).json(error))
                        }
                        
                    })
                    .catch(error => console.log(error))
                    .catch(error => response.status(500).json(error))
                }
                else{
                    console.log("Data pengguna sudah ada");
                    return response.status(400).json({
                        "message" : "Data pengguna sudah ada silahkan coba yang lain",
                        "status":400
                    })
                }
            });
        }
    }).catch( err => console.log(err))
    
}

const updatePengguna = async (request, response) => {
    const body = request.body
    const param = request.params
    
    const validationRule = {
        "name" : "required|string",
        "address" : "required|string"
    }

    await validator(body, validationRule, {}, (err, status) => {
        if (!status) {
            response.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            if(param.id)
            {
                models.queryUpdateToko(param, body)
                .then((data) => {
                    if (data) {
                        console.log(data)
                        console.log("Data Toko Berhasil diupdate");
                        response.status(200).json({
                            "message" : "Data Toko Berhasil diupdate",
                            "data" : data,
                            "status" : 200
                        })
                    }
                })
                .catch(error => console.log(error))
                .catch(error => response.status(500).json(error))
            }
            else{
                return response.status(200).json({
                    "message" : "Data Toko gagal diupdate",
                    "status":400
                })
            }
        }
    }).catch( err => console.log(err))
}

const deletePengguna = (request, response) => {
    const param = request.params
    if(param.id)
    {
        models.queryDeleteToko(param)
        .then((data) => {
            if (data) {
                console.log(data)
                console.log("Data Toko Berhasil dihapus");
                response.status(200).json({
                    "message" : "Data Toko Berhasil dihapus",
                    "status" : 200
                })
            }
        })
        .catch(error => console.log(error))
        .catch(error => response.status(500).json(error))
    }
    else{
        return response.status(200).json({
            "message" : "Data Toko gagal dihapus",
            "status":400
        })
    }
}

module.exports = {
    getAllPengguna,
    createPengguna,
    // updateToko,
    // deleteToko
}