// KapanContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load state from localStorage on component mount
    const savedState = JSON.parse(localStorage.getItem('user'));
    if (savedState) {
      setUser(savedState);
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    console.log("Saving user to local Storage : ",user)
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={[user, setUser ]}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}


