import express from 'express';
import * as appointmentsController from '../controllers/appointmentsController.js';

const router = express.Router();

router.post('/appointments', appointmentsController.createAppointment);
router.delete('/appointments/:appointmentId', appointmentsController.deleteAppointment);
router.get('/appointments/:appointmentId', appointmentsController.getAppointmentDetails);
router.get('/appointments/user/:userId', appointmentsController.listAppointmentsByUser);

export default router;
