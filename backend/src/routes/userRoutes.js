// userRoutes.js
import { Router } from 'express';
import { setUserAsDoctor, removeDoctorRole, setUserAsAdmin, removeAdminRole } from '../controllers/userController.js'; // Importă controller-ul

const router = Router();

router.put('/users/:userId/doctor', setUserAsDoctor);
router.put('/users/:userId/pacient', removeDoctorRole);
router.put('/users/:userId/admin', setUserAsAdmin);
router.put('/users/:userId/user', removeAdminRole);

export default router;
