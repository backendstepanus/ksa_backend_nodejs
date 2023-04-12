const Validator = require('validatorjs');
const penggunaModel = require('../models/pengguna');


const validator = async (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

// Validator.registerAsync('uniquepengguna', function(value,  attribute, req, passes) {
//     if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
//     //split table and column
//     let attArr = attribute.split(',');
//     if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);

//     //assign array index 0 and 1 to table and column respectively
//     const { 0: table, 1: column } = attArr;
//     //define custom error message
//     let msg = `${column} already in use`
//     //check if incoming value already exists in the database
//     penggunaModel[table].valueExists({ [column]: value })
//     .then((result) => {
//         if(result){
//             passes(false, msg); // return false if value exists
//             return;
//         }
//         passes();
//     })
// });

module.exports = validator;