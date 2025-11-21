import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('../pages/HomePage', () => ({
  default: () => <div>Mocked Home</div>,
}));

describe('App', () => {
  it('renders the home page', () => {
    render(<App />);
    expect(screen.getByText('Mocked Home')).toBeInTheDocument();
  });
});
