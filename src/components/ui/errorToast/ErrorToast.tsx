import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useGlobalState } from '../../../context/GlobalStateContext';

export const ErrorToast: React.FC = () => {
  const { errorMessage, setErrorMessage } = useGlobalState();

  useEffect(() => {
    if (errorMessage && errorMessage !== '') {
      toast.error(errorMessage, {
        duration: 3000,
        position: 'bottom-right'
      });
      setErrorMessage('');
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        error: {
          style: {
            fontSize: '14px',
            background: '#52525b',
            color: 'white'
          }
        }
      }}
    />
  );
};
