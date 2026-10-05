import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the college welcome heading', () => {
  render(<App />);
  const heading = screen.getByText(/Welcome to New Horizon College/i);
  expect(heading).toBeInTheDocument();
});
