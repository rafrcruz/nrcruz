import React from 'react';
import { render, screen } from '@testing-library/react';
import { logger } from './services/logger';
import { initSentry } from './services/sentry.jsx';
import { registerGlobalErrorHandlers } from './services/globalErrorHandler';

const renderMock = vi.fn(element => {
  return render(element, { container: document.getElementById('root') });
});

const createRootMock = vi.fn(() => ({
  render: renderMock,
}));

vi.mock('react-dom/client', () => ({
  __esModule: true,
  default: { createRoot: createRootMock },
  createRoot: createRootMock,
}));

vi.mock('./services/logger', () => ({
  logger: {
    info: vi.fn(),
  },
}));

vi.mock('flowbite-react', async () => {
  const actual = await vi.importActual('flowbite-react');

  return {
    __esModule: true,
    ...actual,
    Flowbite: ({ children }) => <div data-testid="flowbite">{children}</div>,
  };
});

vi.mock('./services/sentry.jsx', () => ({
  SentryErrorBoundary: ({ children }) => <div data-testid="boundary">{children}</div>,
  initSentry: vi.fn(),
}));

vi.mock('./services/globalErrorHandler', () => ({
  registerGlobalErrorHandlers: vi.fn(),
}));

vi.mock('./context/AppContext', () => ({
  AppProvider: ({ children }) => <div data-testid="provider">{children}</div>,
}));

vi.mock('./app/App', () => ({
  default: () => <div>AppContent</div>,
}));

vi.mock('./config/env', () => ({
  config: { env: 'test', api: { baseUrl: 'http://example.com' } },
}));

describe('main entrypoint', () => {
  it('initializes services and renders the app', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import('./main.jsx');

    expect(initSentry).toHaveBeenCalled();
    expect(registerGlobalErrorHandlers).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Starting React application', { env: 'test' });
    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'));
    expect(renderMock).toHaveBeenCalled();
    expect(screen.getByText('AppContent')).toBeInTheDocument();
  });
});
