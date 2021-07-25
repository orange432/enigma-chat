import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
const sequelize = new Sequelize({dialect: 'sqlite',storage: './db.sqlite3'});

const Session = sequelize.define('session',{
    id: {type: DataTypes.STRING, primaryKey: true},
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    started: {type: DataTypes.DATE, allowNull: false},
    expiry: {type: DataTypes.DATE, allowNull: false}
});

export default Session;