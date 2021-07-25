import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize({dialect: 'sqlite',storage: './db.sqlite3'});

const Session = sequelize.define('session',{
    id: {type: DataTypes.UUIDV4, primaryKey: true},
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    expiry: {type: DataTypes.DATE, allowNull: false}
});

export default Session;