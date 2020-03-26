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

router.get('/api/showhousehold', async function(req, res, next){
    transaction = await getTransaction();
    try{
        var house_number = req.query.house;
        let members = await Member.findAll({attributes:{exclude: ['h_id', 'living_w_spouse']}, where: {h_id:house_number}, raw: true,transaction});
    
        let house = await Household.findOne({where: {h_id: house_number}, transaction});
        var object = { "House Number": house_number, "HouseholdType": house.housing_type};
        object.members= members;
    
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