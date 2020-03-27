const express = require('express');
const app = express();

var bodyParser = require("body-parser");
const db = require("./sequelize/index.js");

const createHouseholdRouter = require("./routes/createHousehold.js");
const addMemberRouter = require("./routes/addMember.js");
const listHouseholdsRouter = require("./routes/listHouseholds.js");
const showHouseholdRouter = require("./routes/showHousehold.js");
const grantsRouter = require("./routes/grants.js");
const deleteHouseRouter = require("./routes/deleteHousehold.js");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// sequelize.sync({
//   force: true
// }); 

db.sequelize.sync(); 

app.use('/', createHouseholdRouter);
app.use('/', addMemberRouter);
app.use('/', listHouseholdsRouter);
app.use('/', showHouseholdRouter);
app.use('/', grantsRouter);
app.use('/', deleteHouseRouter);


app.listen(1330);

