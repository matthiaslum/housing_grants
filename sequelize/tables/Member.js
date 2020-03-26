const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = (sequelize, DataTypes) =>{
    class Member extends Model {}
    Member.init({
        // attributes
        m_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender:{
            type:DataTypes.CHAR(1),
            allowNull: false,
        },
        marital_status:{
            type:DataTypes.CHAR(1),
            allowNull: false,
        },
        spouse:{
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        occupation_t:{
            type:DataTypes.CHAR(1),
            allowNull: false,
        },
        income:{
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        bday:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        living_w_spouse:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        h_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'member'
        // options
    });
    return Member;
}

