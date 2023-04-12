const crypto = require('crypto')
const environment = process.env.NODE_ENV || 'production';
const configuration = require('../knex')[environment];
const database = require('knex')(configuration);

const queryAllRole = () => {
    return database.raw("SELECT * FROM roles WHERE name_role NOT IN('SuperAdmin')")
    .then((data) => data.rows)
}

const findRole = (body) => {
    return database.raw("SELECT * FROM roles WHERE name_role = ?",[body.nama_role])
    .then((data) => data.rows[0])
}

const queryInsertRole = (body) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO roles (id,name_role) VALUES (?, ?) RETURNING id,name_role", [id, body.nama_role]
        )
        .then((data) => data.rows[0])
}

const queryUpdateRole = (param,body) => {
    return  database.raw("UPDATE roles SET name_role = ? where id = ? RETURNING id,name_role", [body.nama_role, param.id])
    .then((data) => data.rows[0]);
}

const queryDeleteRole = (param) => {
    return  database.raw("DELETE FROM roles WHERE id = ?", [param.id])
    .then((data) => data.rows);
}

module.exports = {
    queryAllRole,
    findRole,
    queryInsertRole,
    queryUpdateRole,
    queryDeleteRole
}