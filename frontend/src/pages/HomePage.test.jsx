import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import HomePage from './HomePage';
import { useHelloMessage } from '../hooks/useHelloMessage';

vi.mock('../hooks/useHelloMessage');

afterEach(() => {
  vi.clearAllMocks();
});

describe('HomePage', () => {
  it('renders loading state', () => {
    useHelloMessage.mockReturnValue({ loading: true, error: null, message: '' });

    render(<HomePage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    useHelloMessage.mockReturnValue({ loading: false, error: new Error('fail'), message: '' });

    render(<HomePage />);

    expect(screen.getByText('Erro ao carregar mensagem.')).toBeInTheDocument();
  });

  it('renders hello message once loaded', () => {
    useHelloMessage.mockReturnValue({ loading: false, error: null, message: 'NRCruz app' });

    render(<HomePage />);

    expect(screen.getByText('Hello NRCruz app')).toBeInTheDocument();
  });
});
