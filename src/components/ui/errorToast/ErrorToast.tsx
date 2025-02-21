import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
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

  return null;
};
