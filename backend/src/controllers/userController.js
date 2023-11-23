import User from '../models/user.js'; 
import Doctor from '../models/doctor.js';

const setUserAsDoctor = async (req, res) => {
  const userId = req.params.userId;
  const { speciality } = req.body; // Preia specializarea din corpul cererii

  if(!userId)
    return res.status(404).json({ message: 'Specificati id-ul' });


  if(!speciality)
    return res.status(404).json({ message: 'Specificati specialitatea' });

  try {
    const [updatedRows] = await User.update(
      { isDoctor: true },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    // Verifică dacă utilizatorul este deja înregistrat ca doctor
    const existingDoctor = await Doctor.findOne({ where: { userId } });
    if (!existingDoctor) {
      // Adaugă utilizatorul și specializarea în tabelul doctori
      await Doctor.create({ userId, speciality });
    } else {
      // Opțional: actualizează specializarea dacă doctorul există deja
      await existingDoctor.update({ speciality });
    }

    res.json({ message: 'Utilizatorul a fost setat ca doctor cu specializarea ' + speciality });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la server', error: error.message });
  }
};

const removeDoctorRole = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(404).json({ message: 'Specificați ID-ul' });
  }

  try {
    const [updatedRows] = await User.update(
      { isDoctor: false },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    const existingDoctor = await Doctor.findOne({ where: { userId } });
    if (existingDoctor) {
      await existingDoctor.destroy();
    }

    res.json({ message: 'Statutul de doctor a fost înlăturat pentru utilizatorul cu ID-ul ' + userId });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la server', error: error.message });
  }
};

const setUserAsAdmin = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(404).json({ message: 'Specificați ID-ul' });
  }

  try {
    const [updatedRows] = await User.update(
      { isAdmin: true },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    res.json({ message: 'Utilizatorul a fost setat ca administrator' });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la server', error: error.message });
  }
};

const removeAdminRole = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(404).json({ message: 'Specificați ID-ul' });
  }

  try {
    const [updatedRows] = await User.update(
      { isAdmin: false },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    res.json({ message: 'Statutul de administrator a fost înlăturat pentru utilizatorul cu ID-ul ' + userId });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la server', error: error.message });
  }
};

export {
  setUserAsDoctor,
  removeDoctorRole,
  setUserAsAdmin,
  removeAdminRole,
};
