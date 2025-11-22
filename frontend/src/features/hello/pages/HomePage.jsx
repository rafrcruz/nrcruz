import { useHelloMessage } from '../hooks/useHelloMessage';

function HomePage() {
  const { loading, error, message } = useHelloMessage();

  if (loading) {
    return <main className="container">Carregando...</main>;
  }

  if (error) {
    return <main className="container">Erro ao carregar mensagem.</main>;
  }

  return <main className="container">Hello {message}</main>;
}

export default HomePage;
