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

// server.listen(port, hostname, () => {
//     console.log("Server is running on " + port);
// });
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });