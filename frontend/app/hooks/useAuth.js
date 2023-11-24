'use client'

import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/authContext';

export const useAuth = () => {
  const { user, loginUser, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/auth/refresh', {
          method: 'POST',
          credentials: 'include' 
        });
        console.log(response);
        if (response.ok) {
          const refreshedData = await response.json();
          loginUser(refreshedData.user);
        } else {
          logoutUser();
        }
      } catch (error) {
        console.error('Error refreshing auth:', error);
        logoutUser();
      }
    };

    checkAuth();
  }, []);

  return { user };
};
