import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Index from './Index';

// Mock components that are used in Index
vi.mock('@/components/ResultsModal', () => ({
  ResultsModal: vi.fn(() => null),
}));

vi.mock('@/components/InvestorForm', () => ({
  InvestorForm: vi.fn(() => <div data-testid="investor-form" />),
}));

vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: vi.fn(() => <button data-testid="theme-toggle">Theme Toggle</button>),
}));

vi.mock('lottie-react', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="lottie-animation" />),
}));

// Mock next-themes to avoid context issues
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

describe('Index Page', () => {
  it('renders the header with logo and title', () => {
    render(<Index />);

    // Check logo is present
    expect(screen.getByAltText('finformatics logo')).toBeInTheDocument();

    // Check title
    expect(screen.getByText('finformatics')).toBeInTheDocument();
    expect(
      screen.getByText('Predictive Modeling for Retail Wealth Diversification')
    ).toBeInTheDocument();
  });

  it('includes the theme toggle in the header', () => {
    render(<Index />);

    // Theme toggle should be rendered
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByText('Theme Toggle')).toBeInTheDocument();
  });

  it('renders the investor profile form', () => {
    render(<Index />);

    expect(screen.getByTestId('investor-form')).toBeInTheDocument();
  });

  it('renders the calculate button', () => {
    render(<Index />);

    expect(
      screen.getByRole('button', { name: /calculate investment strategy/i })
    ).toBeInTheDocument();
  });

  it('renders the "How It Works" information panel', () => {
    render(<Index />);

    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Asset Allocation')).toBeInTheDocument();
    expect(screen.getByText('Investment Amount')).toBeInTheDocument();
  });

  it('has skip to main content link for accessibility', () => {
    render(<Index />);

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
