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


router.get('/api/deleteHousehold', async function(req, res, next){
    transaction = await getTransaction();
    try{
        var house_number = req.query.house_number;
        if (house_number == null){
            throw ("No house number provided");
        }
        else{
            var h_id = parseInt(house_number);
            await Household.destroy({
                where: {
                  h_id: h_id
                }
              })
            await commit(transaction);
            res.status(200).send('Household Deleted');
        }
    }
    catch (err){
        console.log(err);
        await rollback(transaction);
        res.status(404).send(err);
        res.end;
    }
})

module.exports = router;    