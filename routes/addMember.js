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


String.prototype.isValidDate = function() {
    var IsoDateRe = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");
    var matches = IsoDateRe.exec(this);
    if (!matches) return false;


    var composedDate = new Date(matches[1], (matches[2] - 1), matches[3]);


    return ((composedDate.getMonth() == (matches[2] - 1)) &&
            (composedDate.getDate() == matches[3]) &&
            (composedDate.getFullYear() == matches[1]) &&
            (composedDate < new Date(new Date().toDateString()) ) );

}


router.post('/api/addmember', async function(req, res, next){
transaction = await getTransaction();
try{
    var house_number = req.body.house_number;
    let house = await Household.findOne({ where: { h_id: house_number}, transaction});
    if (house == null){
    throw("Invalid house number");
    }
    var name = req.body.name;
    let person = await Member.findOne({ where: { name: name}, transaction});
    if (person != null){
    throw("There already exists a person with the same name");
    }
    var gender = req.body.gender;
    var gender_initial = convertGender(gender);
    if (gender == null){
    throw ("Incorrect gender format. Pls type male or female");
    }
    var marital_status = req.body.marital_status;
    var marital_inital = convertMarital(marital_status);
    if (marital_inital == null){
    throw ("Incorrect marital status format. Pls type single or married");
    }
    var spouse = req.body.spouse;
    if (spouse != null && typeof(spouse) != 'string'){
    throw ("Incorrect spouse format. Pls type name of spouse");
    } 
    var occupation = req.body.occupation;
    var occupation_initial = convertOccupation(occupation);
    if (occupation_initial == null){
    throw ("Incorrect occupation format. Pls type Unemployed, Employed or Student");
    }
    var income = req.body.income;
    if (typeof(income) != 'number'){
    throw ("Pls input a number for income");
    }
    var b_day = req.body.bday;
    if (b_day.isValidDate()!= true){
    throw("Invalid birthday date, pls input format yyyy-mm-dd, earlier than tdy");
    }
    let created = await Member.create({h_id: house_number, name: name, gender: gender_initial, marital_status: marital_inital, spouse: spouse, occupation_t: occupation_initial, income: income, bday: b_day, transaction});
    var member_id = await created.m_id;
    console.log("new member number is ... ");
    console.log(member_id);
    house.total_income += income;
    house.size += 1;
    if (spouse != null){
    let spouse_entry = await Member.findOne({where: {h_id: house_number, name: spouse}, transaction});
    if (spouse_entry != null){
        if (spouse_entry.spouse != name){
        throw("Conflict in spouse! New member's spouse doesn't show the name of the new member");
        }
        house.n_couples += 1;
        created.living_w_spouse = '1';
        spouse_entry.living_w_spouse = '1';
        await created.save();
        await spouse_entry.save();
    }
    }
    await house.save();

    await commit(transaction);
    res.status(200).send('OK');
}
catch (err){
    console.log(err);
    await rollback(transaction);
    res.status(404).send(err);
    res.end;
}
})


module.exports = router;    