import PropTypes from 'prop-types';

function AppShell({ title = 'NRCruz', children }) {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{ '--app-shell-header-height': '4rem' }}
    >
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="text-lg font-semibold tracking-tight">{title}</div>
          <div className="text-sm text-slate-400">Aplicação</div>
        </header>

        <main className="flex flex-1 items-stretch py-6" role="main">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

AppShell.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default AppShell;
