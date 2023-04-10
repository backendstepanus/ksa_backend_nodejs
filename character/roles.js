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
const { builtinModules } = require('module');
const { resolve } = require('path');
const { request } = require('http');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({
    extended: true,
}));


//action
const getAllRole = (request, response) => {
    queryAllRole()
    .then(data => {
        response.status(200).json({
            "message" : "Data Role",
            "data" : data,
            "status" : 200
        })
    })
    .catch(error => console.log(error))
    .catch(error => res.status(500).json(error))
}

const createRole = (request, response) => {
    const rolename = request.body;
    if(rolename)
    {
        queryInsertRole(rolename)
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
        .catch(error => res.status(500).json(error))
    }
    else{
        return response.status(200).json({
            "message" : "Data Role sudah ada",
            "status":400
        })
    }
    
}

const updateRole = (request, response) => {
    const body = request.body
    const param = request.params
    if(param.id)
    {
        queryUpdateRole(param, body)
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
        .catch(error => res.status(500).json(error))
    }
    else{
        return response.status(200).json({
            "message" : "Data Role gagal diupdate",
            "status":400
        })
    }
}

const deleteRole = (request, response) => {
    const param = request.params
    if(param.id)
    {
        queryDeleteRole(param)
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
        .catch(error => res.status(500).json(error))
    }
    else{
        return response.status(200).json({
            "message" : "Data Role gagal dihapus",
            "status":400
        })
    }
}

//query
const queryAllRole = () => {
        return database.raw("SELECT * FROM roles")
        .then((data) => data.rows)
}

const queryInsertRole = (rolename) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO roles (id,name_role) VALUES (?, ?) RETURNING id,name_role", [id, rolename.nama_role]
        )
        .then((data) => data.rows[0])
}

const queryUpdateRole = (id,rolename) => {
   return  database.raw("UPDATE roles SET name_role = ? where id = ? RETURNING id,name_role", [rolename.nama_role,id.id])
    .then((data) => data.rows[0]);
}

const queryDeleteRole = (id) => {
    return  database.raw("DELETE FROM roles WHERE id = ?", [id.id])
    .then((data) => data.rows);
}



module.exports = {
    getAllRole,
    createRole,
    updateRole,
    deleteRole
}