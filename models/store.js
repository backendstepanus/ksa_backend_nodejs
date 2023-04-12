const crypto = require('crypto')
const environment = process.env.NODE_ENV || 'production';
const configuration = require('../knex')[environment];
const database = require('knex')(configuration);

const queryAllStore = () => {
    return database.raw("SELECT * FROM toko INNER JOIN pengguna ON pengguna.toko_id = toko.id WHERE pengguna.role_id IN ('9a21e410-3c1f-4f98-a50a-06cbe2097960') ORDER BY toko.id DESC")
    .then((data) => data.rows)
}

const queryfindStore = (body) => {
    return database.raw("SELECT * FROM toko WHERE nama_toko = ? AND alamat_toko = ?",[body.nama_toko, body.alamat_toko])
    .then((data) => data.rows[0])
}

const queryMasterStore = () => {
    return database.raw("SELECT * FROM toko ORDER BY toko.id DESC")
    .then((data) => data.rows)
}

const queryInsertStore = (body) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO toko (id,nama_toko,alamat_toko) VALUES (?, ?, ?) RETURNING id,nama_toko,alamat_toko", [id, body.nama_toko, body.alamat_toko]
        )
        .then((data) => data.rows[0])
}

const queryUpdateToko = (param, body) => {
    return  database.raw("UPDATE toko SET nama_toko = ?, alamat_toko = ? where id = ? RETURNING id,nama_toko,alamat_toko", [body.nama_toko, body.alamat_toko, param.id])
    .then((data) => data.rows[0]);
}

const queryDeleteToko = (param) => {
    return  database.raw("DELETE FROM toko WHERE id = ?", [param.id])
    .then((data) => data.rows);
}

module.exports = {
    queryAllStore,
    queryfindStore,
    queryMasterStore,
    queryInsertStore,
    queryUpdateToko,
    queryDeleteToko
}