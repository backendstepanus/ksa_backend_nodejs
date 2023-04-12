const crypto = require('crypto')
const environment = process.env.NODE_ENV || 'production';
const configuration = require('../knex')[environment];
const database = require('knex')(configuration);

const queryAllAccount = () => {
    return database.raw("SELECT * FROM pengguna INNER JOIN account ON account.pengguna_id = pengguna.id ORDER BY account.id DESC")
    .then((data) => data.rows)
}

const queryInsertAccount = (username, password, pengguna_id) => {
    const id = crypto.randomUUID();
    console.log(id);
    return database.raw(
            "INSERT INTO account (id,username,password,pengguna_id) VALUES (?, ?, ?, ?) RETURNING id,username,password,pengguna_id", [id, username, password, pengguna_id]
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
    queryAllAccount,
    queryInsertAccount,
    queryUpdateToko,
    queryDeleteToko
}