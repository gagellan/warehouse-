import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home Page with Demo and Free Trial buttons', () => {
  render(<App />);
  const demoButton = screen.getByText(/Get a Demo/i);
  const trialButton = screen.getByText(/Free Trial/i);
  expect(demoButton).toBeInTheDocument();
  expect(trialButton).toBeInTheDocument();
});

test('navigates to Demo Page', () => {
  render(<App />);
  const demoButton = screen.getByText(/Get a Demo/i);
  demoButton.click();
  const demoHeading = screen.getByText(/Request A Demo/i);
  expect(demoHeading).toBeInTheDocument();
});

test('navigates to Free Trial Page', () => {
  render(<App />);
  const trialButton = screen.getByText(/Free Trial/i);
  trialButton.click();
  const trialHeading = screen.getByText(/Request A Free Trial/i);
  expect(trialHeading).toBeInTheDocument();
});