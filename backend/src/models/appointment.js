import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import User from './User.js';

const Appointment = sequelize.define('Appointment', {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'appointments',
});

// Definește relațiile
Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'Doctor', foreignKey: 'doctorId' });

export default Appointment;
