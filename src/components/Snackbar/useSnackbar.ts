import { useEffect, useState } from 'react';

export const useSnackbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        setIsActive(false);
      }, 2000);
    }
  }, [isActive]);

  const openSnackBar = (msg: string): void => {
    setMessage(msg);
    setIsActive(true);
  };

  return { isActive, message, openSnackBar };
};
