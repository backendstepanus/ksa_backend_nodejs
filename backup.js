// const hashPassword = (req) => {
//     const userREG = req.body
//     return new Promise((resolve, reject) =>
//         bcrypt.hash(userREG.password, 10, (err, hash) => {
//             err ? reject(err) : resolve(hash)
//             console.log(hash);
//         })
//     )
// }

// router.post('/hash_password', superadmin.hashPassword)