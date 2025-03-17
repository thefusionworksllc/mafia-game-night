import React, { createContext, useContext, useState } from 'react';
import ErrorToast from '../components/ErrorToast';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState({ visible: false, message: '', type: 'error' });

  const showError = (message, type = 'error') => {
    setError({ visible: true, message, type });
  };

  const hideError = () => {
    setError({ ...error, visible: false });
  };

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      <ErrorToast 
        visible={error.visible} 
        message={error.message} 
        type={error.type}
        onHide={hideError} 
      />
    </ErrorContext.Provider>
  );
}; 