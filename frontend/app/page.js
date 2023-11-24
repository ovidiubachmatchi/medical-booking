'use client'

import styles from './page.module.scss';
import { useAuth } from './hooks/useAuth';
import Login from './auth/login';

const Page = () => {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  } else {
    // Utilizatorul nu este autentificat, returnați pagina pentru vizitatori
    return <Login />;
  }
};

export default Page;
