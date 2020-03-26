var express = require('express');
var router = express.Router();

const db = require("../sequelize/index.js");
const { Op } = require("sequelize");

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


router.get('/api/grants', async function(req, res, next){
    transaction = await getTransaction();
    try{
        var result= {};
        house_type_filter = convertHouseType(req.query.housetype);
        max_income_filter = parseFloat(req.query.totalincome);
        max_size_filter = parseInt(req.query.size);

        //Student Encouragement Bonus
        let houses_under_16 = await Member.findAll({attributes: ['h_id'], 
        where: sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')), 
        {
        [Op.lt] : 16
        }), 
        raw: true,
        transaction});

        var set = new Set();
        for (let house of houses_under_16){
        set.add(house.h_id);
        }

        SEB = []; //array to store households of student encouragement bonus
        for (let h_id of set){

            let house = await Household.findOne({where : {h_id : h_id}, transaction, raw: true});
            if ((house.total_income < 150000)){
                if (Number.isNaN(max_income_filter) != true){
                    if (house.total_income >= max_income_filter) continue;
                }
                if (Number.isNaN(max_size_filter) != true){
                    if (house.size >= max_size_filter) continue;
                }
                if (house_type_filter != null){
                    if (house.housing_type != house_type_filter) continue;
                }
                house_json = {};
                house_json.h_id = h_id;
                house_json.HouseholdType = house.housing_type;
                
                let qualifying_children = await Member.findAll({attributes: {exclude: ['living_w_spouse', 'h_id']}, 
                where: {[Op.and]: [{h_id: h_id}, sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')), 
                {
                [Op.lt] : 16
                }) 
                ]},
                raw: true,
                transaction});

                house_json.qualifying_members = qualifying_children;
                SEB.push(house_json);
            }
        }
        result.student_encouragement_bonus = SEB;

        //Family Togetherness Scheme
        let houses_under_18 = await Member.findAll({attributes: ['h_id'], 
        where: sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')), 
        {
        [Op.lt] : 18
        }), 
        raw: true,
        transaction});

        var set = new Set();
        for (let house of houses_under_18){
        set.add(house.h_id);
        }

        FTS = [] //array to store households of Family togetherness Scheme

        for (let h_id of set){
            let house = await Household.findOne({where : {h_id : h_id}, transaction, raw: true});
            if (house.n_couples > 0){
                if (Number.isNaN(max_income_filter) != true){
                    if (house.total_income >= max_income_filter) continue;
                }
                if (Number.isNaN(max_size_filter) != true){
                    if (house.size >= max_size_filter) continue;
                }
                if (house_type_filter != null){
                    if (house.housing_type != house_type_filter) continue;
                }
                house_json = {};
                house_json.h_id = h_id;
                house_json.HouseholdType = house.housing_type;
                
                let qualifying_members = await Member.findAll({attributes: {exclude: ['living_w_spouse', 'h_id']}, 
                where: {[Op.or]:[
                {[Op.and]: 
                    [{h_id: h_id}, 
                    {living_w_spouse: '1'}
                    ]
                }, 
                {[Op.and]: 
                    [{h_id: h_id}, 
                    sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')),  {[Op.lt] : 16 }) 
                    ]
                }
                ]},
                raw: true,
                transaction});

                house_json.qualifying_members = qualifying_members;
                FTS.push(house_json);
            }
        }
        result.family_togetherness_scheme = FTS;

        //Elder Bonus
        let houses_over_50 = await Member.findAll({attributes: ['h_id'], 
        where: sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')), 
        {
        [Op.gt] : 50
        }), 
        raw: true,
        transaction});

        var set = new Set();
        for (let house of houses_over_50){
        set.add(house.h_id);
        }

        EB = []; //array to store households of elder bonus
        for (let h_id of set){
            let house = await Household.findOne({where : {h_id : h_id}, transaction, raw: true});
            if (Number.isNaN(max_income_filter) != true){
                if (house.total_income >= max_income_filter) continue;
            }
            if (Number.isNaN(max_size_filter) != true){
                if (house.size >= max_size_filter) continue;
            }
            if (house_type_filter != null){
                if (house.housing_type != house_type_filter) continue;
            }
            house_json = {};
            house_json.h_id = h_id;
            house_json.HouseholdType = house.housing_type;
            
            let qualifying_elderly = await Member.findAll({attributes: {exclude: ['living_w_spouse', 'h_id']}, 
            where: {[Op.and]: [{h_id: h_id}, sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')), 
            {
                [Op.gt] : 50
            }) 
            ]},
            raw: true,
            transaction});

            house_json.qualifying_members = qualifying_elderly;
            EB.push(house_json);
        }
        result.elder_bonus = EB;

        //Baby Sunshine Bonus
        let houses_under_5 = await Member.findAll({attributes: ['h_id'], 
        where: sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')), 
        {
        [Op.lt] : 5
        }), 
        raw: true,
        transaction});

        var set = new Set();
        for (let house of houses_under_5){
        set.add(house.h_id);
        }

        BSB = []; //array to store households of baby sunshine bonus
        for (let h_id of set){
            let house = await Household.findOne({where : {h_id : h_id}, transaction, raw: true});
            if (Number.isNaN(max_income_filter) != true){
                if (house.total_income >= max_income_filter) continue;
            }
            if (Number.isNaN(max_size_filter) != true){
                if (house.size >= max_size_filter) continue;
            }
            if (house_type_filter != null){
                if (house.housing_type != house_type_filter) continue;
            }
            house_json = {};
            house_json.h_id = h_id;
            house_json.HouseholdType = house.housing_type;
            
            let qualifying_babies = await Member.findAll({attributes: {exclude: ['living_w_spouse', 'h_id']}, 
            where: {[Op.and]: [{h_id: h_id}, sequelize.where(sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('bday'), sequelize.fn('NOW')), 
            {
                [Op.lt] : 5
            }) 
            ]},
            raw: true,
            transaction});

            house_json.qualifying_members = qualifying_babies;
            BSB.push(house_json);
        }
        result.baby_sunshine_grant = BSB;

        //YOLO GST GRANT
        let houses_under_100000 = await Household.findAll({attributes: ['h_id'], 
        where: {total_income: {[Op.lt]: 100000}}, raw: true, transaction});

        YOLO = []; //array to store households of baby sunshine bonus
        for (let item of houses_under_100000){
            var h_id = item.h_id;

            let house = await Household.findOne({where : {h_id : h_id}, transaction, raw: true});
            if (Number.isNaN(max_income_filter) != true){
                if (house.total_income >= max_income_filter) continue;
            }
            if (Number.isNaN(max_size_filter) != true){
                if (house.size >= max_size_filter) continue;
            }
            if (house_type_filter != null){
                if (house.housing_type != house_type_filter) continue;
            }
            house_json = {};
            house_json.h_id = h_id;
            house_json.HouseholdType = house.housing_type;
            
            let qualifying_members = await Member.findAll({attributes: {exclude: ['living_w_spouse', 'h_id']}, 
            where: {h_id: h_id}, raw: true, transaction});

            house_json.qualifying_members = qualifying_members;
            YOLO.push(house_json);
        }
        result.yolo_gst_grant = YOLO;    

        await commit(transaction);
        res.status(200).send(result);
    }
    catch (err){
        console.log(err);
        await rollback(transaction);
        res.status(404).send(err);
        res.end;
    }
})

module.exports=router;