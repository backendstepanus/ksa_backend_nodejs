const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const validator = require('../helpers/validate');
const models = require('../models/roles');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true,
}));


//action
const getAllRole = (request, response) => {
    models.queryAllRole()
    .then(data => {
        console.log(data)
        response.status(200).json({
            "message" : "Data Role",
            "data" : data,
            "status" : 200
        })
    })
    .catch(error => console.log(error))
    .catch(error => response.status(500).json(error))
}

const createRole = async (request, response) => {
    const body = request.body;
    let data
    const validationRule = {
        "nama_role" : "required|string"
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
            models.queryFindRole(body)
            .then(value => {
                data = value
                if(data === undefined)
                {
                    if(body)
                    {
                        models.queryInsertRole(body)
                        .then(data => {
                            console.log(data)
                            console.log("Data Role Berhasil ditambah");
                            response.status(200).json({
                                "message" : "Data Role Berhasil ditambah",
                                "data" : data,
                                "status" : 200
                            })
                        })
                        .catch(error => console.log(error))
                        .catch(error => response.status(500).json(error))
                    }
                    else{
                        return response.status(400).json({
                            "message" : "Data Role sudah ada",
                            "status":400
                        })
                    }
                }
                else{
                    console.log("Data role sudah ada");
                    return response.status(400).json({
                        "message" : "Data Role sudah ada silahkan coba yang lain",
                        "status":400
                    })
                }
            })
        }
    }).catch( err => console.log(err))
    
}

const updateRole = async (request, response) => {
    const body = request.body
    const param = request.params
    
    const validationRule = {
        "nama_role" : "required|string"
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
                models.queryUpdateRole(param, body)
                .then((data) => {
                    if (data) {
                        console.log(data)
                        console.log("Data Role Berhasil diupdate");
                        response.status(200).json({
                            "message" : "Data Role Berhasil diupdate",
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
                    "message" : "Data Role gagal diupdate",
                    "status":400
                })
            }
        }
    }).catch( err => console.log(err))
}

const deleteRole = (request, response) => {
    const param = request.params
    if(param.id)
    {
        models.queryDeleteRole(param)
        .then((data) => {
            if (data) {
                console.log(data)
                console.log("Data Role Berhasil dihapus");
                response.status(200).json({
                    "message" : "Data Role Berhasil dihapus",
                    "status" : 200
                })
            }
        })
        .catch(error => console.log(error))
        .catch(error => response.status(500).json(error))
    }
    else{
        return response.status(400).json({
            "message" : "Data Role gagal dihapus",
            "status":400
        })
    }
}

module.exports = {
    getAllRole,
    createRole,
    updateRole,
    deleteRole
}