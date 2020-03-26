const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = (sequelize, DataTypes) =>{ 
    class Household extends Model {}
    Household.init({
        // attributes
        h_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        housing_type: {
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        total_income: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        n_couples:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'household'
        // options
    });
    return Household;
}
