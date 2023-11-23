import Appointment from '../models/appointment.js';
import User from '../models/user.js';
import { Op } from 'sequelize';

async function createAppointment(req, res) {
  try {
    const { patientId, doctorId, appointmentDate } = req.body;

    // Verifică dacă pacientul și doctorul există
    const patient = await User.findByPk(patientId);
    const doctor = await User.findByPk(doctorId);
    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Pacientul sau doctorul nu există' });
    }

    // Verifică dacă doctorul are isDoctor = true
    if (!doctor.isDoctor) {
      return res.status(403).json({ message: 'Utilizatorul selectat nu este doctor' });
    }

    const appointmentDateObj = new Date(appointmentDate);
    if (isNaN(appointmentDateObj.getTime())) {
      return res.status(400).json({ message: 'Data programării este invalidă' });
    }

    // Verifică disponibilitatea intervalului de timp
    const endAppointmentDate = new Date(appointmentDateObj.getTime() + 29 * 60000);
    const conflictingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate: {
          [Op.between]: [appointmentDate, endAppointmentDate],
        },
      },
    });
    if (conflictingAppointment) {
      return res.status(409).json({ message: 'Intervalul de timp nu este disponibil' });
    }

    // Crează programarea
    const appointmentInstance = Appointment.build({
      patientId,
      doctorId,
      appointmentDate,
    });

    const newAppointment = await appointmentInstance.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la crearea programării', error: error.message });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Programarea nu a fost găsită' });
    }

    await appointment.destroy();
    res.status(200).json({ message: 'Programarea a fost ștearsă cu succes' });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la ștergerea programării', error: error.message });
  }
}

async function getAppointmentDetails(req, res) {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Programarea nu a fost găsită' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea detaliilor programării', error: error.message });
  }
}

async function listAppointmentsByUser(req, res) {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.findAll({
      where: {
        [Op.or]: [{ patientId: userId }, { doctorId: userId }]
      }
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la listarea programărilor', error: error.message });
  }
}

export { createAppointment, deleteAppointment, getAppointmentDetails, listAppointmentsByUser }