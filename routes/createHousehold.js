var express = require('express');
var router = express.Router();

const db = require("../sequelize/index.js");

const Household = db.Household;
const Member = db.Member;
const sequelize = db.sequelize;

const getTransaction = async () => sequelize.transaction();
const commit = async (transaction)=> transaction.commit();
const rollback = async (transaction) => transaction.rollback(); 

const helper = require("./helper_functions.js");
convertGender = helper.convertGender;
convertHouseType = helper.convertHouseType;
convertMarital = helper.convertMarital;
convertOccupation = helper.convertOccupation;


router.post('/api/createhousehold', async function(req, res, next){
    transaction = await getTransaction();
    try{
        var house_type = convertHouseType(req.body.house_type);
        if (house_type == null){
        throw(" Not a valid housing type! Housing types are 'Landed', 'Condominium', or 'HDB' ")
        }
        let created = await Household.create({housing_type: house_type, transaction});
        var house_number = await created.h_id;
        var object ={ "house_number": house_number};
        await commit(transaction);
        res.status(200).send(object);
    }
    catch (err){
        console.log(err);
        await rollback(transaction);
        res.status(404).send(err);
        res.end;
    }
    })

module.exports = router;    