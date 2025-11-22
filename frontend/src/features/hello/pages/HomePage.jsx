import { useHelloMessage } from '../hooks/useHelloMessage';

function HomePage() {
  const { loading, error, message } = useHelloMessage();

  if (loading) {
    return (
      <main className="container" aria-busy="true" aria-live="polite">
        <h1 className="m-0 text-inherit font-inherit">Carregando...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container" role="alert" aria-live="assertive">
        <h1 className="m-0 text-inherit font-inherit">Erro ao carregar mensagem.</h1>
      </main>
    );
  }

  return (
    <main className="container" aria-live="polite">
      {/** Use a top-level heading to keep semantic structure consistent across pages. */}
      <h1 className="m-0 text-inherit font-inherit">Hello {message}</h1>
    </main>
  );
}

export default HomePage;
