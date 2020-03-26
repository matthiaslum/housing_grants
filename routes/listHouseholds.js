const fetch = require("node-fetch");
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


router.get('/api/allhouseholds', async function(req, res, next){
    new_transaction = await getTransaction();
    try{
        let houses = await Household.findAll({raw: true,new_transaction});
        console.log("All houses are...");
        var output = new Array();
        for (idx in houses){
        house_id = houses[idx].h_id;
        let household_details = await fetch('http://localhost:1330/api/showhousehold?house='+String(house_id)).then(function(resp){return resp.json()}, new_transaction);
        console.log("Household details:", household_details);
        output.push(household_details);
        }
        console.log("output", output);
    
        res.status(200).send(output);
        await commit(new_transaction);
    }
    catch (err){
        console.log(err);
        await rollback(transaction);
        res.status(404).send(err);
        res.end;
    }
    })

module.exports = router;        