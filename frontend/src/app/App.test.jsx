import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('../features/hello/pages/HomePage', () => ({
  default: () => <div>Mocked Home</div>,
}));

describe('App', () => {
  it('renders the home page', async () => {
    render(<App />);
    expect(await screen.findByText('Mocked Home')).toBeInTheDocument();
  });
});
