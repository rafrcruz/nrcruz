import { useHelloMessage } from '../hooks/useHelloMessage';

function HomePage() {
  const { loading, error, message } = useHelloMessage();

  if (loading) {
    return (
      <main className="container" aria-busy="true" aria-live="polite">
        Carregando...
      </main>
    );
  }

  if (error) {
    return (
      <main className="container" role="alert" aria-live="assertive">
        Erro ao carregar mensagem.
      </main>
    );
  }

  return (
    <main className="container" aria-live="polite">
      Hello {message}
    </main>
  );
}

export default HomePage;
