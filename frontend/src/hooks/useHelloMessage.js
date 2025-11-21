import { useEffect, useState } from 'react';
import { getHelloMessage } from '../services/helloService';

export function useHelloMessage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMessage = async () => {
      try {
        const result = await getHelloMessage();
        if (!isMounted) return;
        setMessage(result);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
        setMessage('');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMessage();

    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, error, message };
}
