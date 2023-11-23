// models/User.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js'; // Ajustează calea dacă este necesar

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isDoctor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users',
});

export default UserModel;