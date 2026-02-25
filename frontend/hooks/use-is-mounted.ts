import { useRef, useEffect } from 'react';

export const useIsMounted = () => {
  const ref = useRef(true);

  useEffect(() => {
    return () => {
      ref.current = false;
    };
  }, []);

  return ref;
};
