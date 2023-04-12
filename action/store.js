const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const validator = require('../helpers/validate');
const models = require('../models/store');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true,
}));


//action
const getAllToko = (request, response) => {
    models.queryAllStore()
    .then(data => {
        console.log(data)
        response.status(200).json({
            "message" : "Data Toko",
            "data" : data,
            "status" : 200
        })
    })
    .catch(error => console.log(error))
    .catch(error => response.status(500).json(error))
}

const getMasterToko = (request, response) => {
    models.queryMasterStore()
    .then(data => {
        console.log(data)
        response.status(200).json({
            "message" : "Data Toko",
            "data" : data,
            "status" : 200
        })
    })
    .catch(error => console.log(error))
    .catch(error => response.status(500).json(error))
}

const createToko = async (request, response) => {
    const body = request.body;
    let data
    const validationRule = {
        "nama_toko" : "required|string",
        "alamat_toko" : "required|string"
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
            models.queryfindStore(body)
            .then(value => {
                data = value
                if(data === undefined)
                {
                    if(body)
                    {
                        models.queryInsertStore(body)
                        .then(data => {
                            console.log(data)
                            console.log("Data Toko Berhasil ditambah");
                            response.status(200).json({
                                "message" : "Data Toko Berhasil ditambah",
                                "data" : data,
                                "status" : 200
                            })
                        })
                        .catch(error => console.log(error))
                        .catch(error => response.status(500).json(error))
                    }
                    else{
                        return response.status(400).json({
                            "message" : "Data Toko sudah ada",
                            "status":400
                        })
                    }
                }
                else{
                    console.log("Data Toko sudah ada");
                    return response.status(400).json({
                        "message" : "Data Toko sudah ada",
                        "status":400
                    })
                }
            })
        }
    }).catch( err => console.log(err))
    
}

const updateToko = async (request, response) => {
    const body = request.body
    const param = request.params
    
    const validationRule = {
        "nama_toko" : "required|string",
        "alamat_toko" : "required|string"
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
                return response.status(400).json({
                    "message" : "Data Toko gagal diupdate",
                    "status":400
                })
            }
        }
    }).catch( err => console.log(err))
}

const deleteToko = (request, response) => {
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
        return response.status(400).json({
            "message" : "Data Toko gagal dihapus",
            "status":400
        })
    }
}

module.exports = {
    getAllToko,
    getMasterToko,
    createToko,
    updateToko,
    deleteToko
}