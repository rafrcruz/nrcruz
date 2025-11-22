import { BaseContainer } from '../../../components/ui';
import { useHelloMessage } from '../hooks/useHelloMessage';

function HomePage() {
  const { loading, error, message } = useHelloMessage();

  if (loading) {
    return (
      <BaseContainer aria-busy="true" aria-live="polite">
        <h1 className="m-0 text-inherit font-inherit">Carregando...</h1>
      </BaseContainer>
    );
  }

  if (error) {
    return (
      <BaseContainer role="alert" aria-live="assertive">
        <h1 className="m-0 text-inherit font-inherit">Erro ao carregar mensagem.</h1>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer aria-live="polite">
      {/** Use a top-level heading to keep semantic structure consistent across pages. */}
      <h1 className="m-0 text-inherit font-inherit">Hello {message}</h1>
    </BaseContainer>
  );
}

export default HomePage;
