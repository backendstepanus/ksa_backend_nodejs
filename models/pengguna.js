const crypto = require('crypto')
const environment = process.env.NODE_ENV || 'production';
const configuration = require('../knex')[environment];
const database = require('knex')(configuration);

const queryAllPengguna = () => {
    return database.raw("SELECT * FROM pengguna INNER JOIN toko ON toko.id = pengguna.toko_id INNER JOIN roles ON roles.id = pengguna.role_id INNER JOIN account ON account.pengguna_id = pengguna.id ORDER BY pengguna.id DESC")
    .then((data) => data.rows)
}

const queryfindPengguna = (body) => {
    return database.raw("SELECT * FROM pengguna WHERE nama_pengguna = ? AND toko_id = ? AND role_id = ?", [body.nama_pengguna, body.toko_id, body.role_id])
    .then((data) => data.rows[0])
}

const queryInsertPengguna = (body) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO pengguna (id,nama_pengguna,toko_id,role_id,status) VALUES (?, ?, ?, ?, ?) RETURNING id,nama_pengguna,toko_id,role_id,status", [id, body.nama_pengguna, body.toko_id, body.role_id, body.status]
        )
        .then((data) => data.rows[0])
}

const queryUpdateToko = (param, body) => {
    return  database.raw("UPDATE toko SET nama_toko = ?, alamat_toko = ? where id = ? RETURNING id,nama_toko,alamat_toko", [body.name, body.address, param.id])
    .then((data) => data.rows[0]);
}

const queryDeleteToko = (param) => {
    return  database.raw("DELETE FROM toko WHERE id = ?", [param.id])
    .then((data) => data.rows);
}

module.exports = {
    queryAllPengguna,
    queryfindPengguna,
    queryInsertPengguna,
    queryUpdateToko,
    queryDeleteToko
}