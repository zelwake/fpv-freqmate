/**
 * Custom render utilities for React Native Testing Library
 * Provides wrapper with necessary providers
 */

import { DeviceScreenProvider } from '@/contexts/DeviceContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react-native';
import React, { PropsWithChildren, ReactElement } from 'react';

/**
 * Custom render options
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom QueryClient for test
   */
  queryClient?: QueryClient;
  /**
   * Add DeviceScreenProvider wrapper (for DeviceList tests)
   */
  withDeviceContext?: boolean;
}

/**
 * Creates new QueryClient for test with disabled retry and caching
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Custom render function with wrappers
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    withDeviceContext = false,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Wrapper component
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {withDeviceContext ? <DeviceScreenProvider>{children}</DeviceScreenProvider> : children}
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

/**
 * Re-exports from @testing-library/react-native for convenience
 */
export * from '@testing-library/react-native';

/**
 * Custom render as default export
 */
export { renderWithProviders as render };
