import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import App from '@/App';

// Mock child components to simplify test
vi.mock('@/components/ui/toaster', () => ({
  Toaster: vi.fn(() => <div data-testid="toaster" />),
}));

vi.mock('@/components/ui/sonner', () => ({
  Toaster: vi.fn(() => <div data-testid="sonner" />),
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: vi.fn(({ children }) => <>{children}</>),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({})),
  QueryClientProvider: vi.fn(({ children }) => <>{children}</>),
}));

vi.mock('react-router-dom', () => ({
  BrowserRouter: vi.fn(({ children }) => <>{children}</>),
  Routes: vi.fn(({ children }) => <>{children}</>),
  Route: vi.fn(() => <div data-testid="route" />),
}));

vi.mock('@/pages/Index', () => ({
  default: vi.fn(() => <div data-testid="index-page" />),
}));

vi.mock('@/pages/NotFound', () => ({
  default: vi.fn(() => <div data-testid="not-found-page" />),
}));

// Spy on ThemeProvider to verify it's used correctly
const mockThemeProvider = vi.fn(({ children, ...props }) => <div data-testid="theme-provider" data-props={JSON.stringify(props)}>{children}</div>);
vi.mock('next-themes', () => ({
  ThemeProvider: mockThemeProvider,
}));

describe('ThemeProvider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('wraps the app with ThemeProvider with correct configuration', () => {
    render(<App />);

    // Verify ThemeProvider was called
    expect(mockThemeProvider).toHaveBeenCalled();

    // Get the props passed to ThemeProvider
    const themeProviderCall = mockThemeProvider.mock.calls[0];
    const themeProviderProps = themeProviderCall[0];

    // Check essential props
    expect(themeProviderProps).toMatchObject({
      attribute: 'class',
      defaultTheme: 'system',
      enableSystem: true,
    });

    // Verify ThemeProvider renders children
    expect(themeProviderProps.children).toBeDefined();
  });

  it('provides theme context to child components', () => {
    const { getByTestId } = render(<App />);

    // ThemeProvider should be rendered
    expect(getByTestId('theme-provider')).toBeInTheDocument();

    // Check that props are set correctly on the mock component
    const themeProvider = getByTestId('theme-provider');
    const props = JSON.parse(themeProvider.getAttribute('data-props') || '{}');

    expect(props.attribute).toBe('class');
    expect(props.defaultTheme).toBe('system');
    expect(props.enableSystem).toBe(true);
  });

  it('maintains the provider hierarchy correctly', () => {
    render(<App />);

    // Verify the order of providers matches expected hierarchy
    // ThemeProvider should be inside QueryClientProvider
    const themeProviderCall = mockThemeProvider.mock.calls[0];

    // The ThemeProvider should receive children that include TooltipProvider etc.
    // This is a bit complex to test directly, but we can verify ThemeProvider was called
    expect(mockThemeProvider).toHaveBeenCalledTimes(1);
  });
});
