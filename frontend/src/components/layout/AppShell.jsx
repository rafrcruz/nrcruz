import PropTypes from 'prop-types';

function AppShell({ title = 'NRCruz', children }) {
  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-100"
      style={{ '--app-shell-header-height': '4rem' }}
    >
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4">
        <header className="flex h-16 items-center border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div aria-hidden className="hidden" data-slot="mobile-navigation-trigger" />
              <div className="text-lg font-semibold tracking-tight">{title}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-400">Aplicação</div>
              <div aria-hidden className="hidden" data-slot="header-actions" />
            </div>
          </div>
        </header>

        <div aria-hidden className="hidden" data-slot="mobile-navigation-surface" />

        <main className="flex flex-1 items-stretch py-6" role="main">
          <div className="w-full">{children}</div>
        </main>

        <div aria-hidden className="hidden" data-slot="bottom-navigation" />
      </div>
    </div>
  );
}

AppShell.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default AppShell;
