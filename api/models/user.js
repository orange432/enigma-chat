import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
const sequelize = new Sequelize({dialect: 'sqlite',storage: './db.sqlite3'});

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    salt: {type: DataTypes.STRING, allowNull: false},
    publicKey: {type: DataTypes.TEXT, allowNull: false},
    privateKey: {type: DataTypes.TEXT, allowNull: false}
});

export default User;