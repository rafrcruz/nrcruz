function LoadingFallback() {
  return (
    <main className="container" aria-busy="true" aria-live="polite">
      <div className="text-center text-gray-600">Carregando aplicação...</div>
    </main>
  );
}

export default LoadingFallback;
