import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hello`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const text = await res.text();
        setMessage(text);
        setStatus('success');
      } catch (error) {
        console.error('Failed to load message:', error);
        setStatus('error');
      }
    };

    fetchMessage();
  }, []);

  if (status === 'loading') {
    return <main className="container">Carregando...</main>;
  }

  if (status === 'error') {
    return <main className="container">Erro ao carregar mensagem.</main>;
  }

  return <main className="container">Hello {message}</main>;
}

export default App;
