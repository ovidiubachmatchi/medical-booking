import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../database/database.js';
import User from './user.js'

export default class Doctor extends Model {}

Doctor.init({
    speciality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Doctor',
    timestamps: false
});

Doctor.belongsTo(User, { foreignKey: 'userId' });
