import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize({dialect: 'sqlite',storage: './db.sqlite3'});

const Message = sequelize.define('message',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    from: {type: DataTypes.INTEGER, allowNull: false},
    to: {type: DataTypes.INTEGER, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false},
    time: {type: DataTypes.DATE, allowNull: false}
});

export default Message;