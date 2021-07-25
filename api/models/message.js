import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
const sequelize = new Sequelize({dialect: 'sqlite',storage: './db.sqlite3',logging: false});

const Message = sequelize.define('message',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    from: {type: DataTypes.INTEGER, allowNull: false},
    to: {type: DataTypes.INTEGER, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false},
    time: {type: DataTypes.DATE, allowNull: false}
});

export default Message;