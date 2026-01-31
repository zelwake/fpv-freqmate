# Testing Guidelines

## Test Language

All test descriptions, test names, and code comments should be written in **English** to maintain consistency with the codebase.

## Testing Library Queries

**Always use `screen` from `@testing-library/react-native` instead of destructuring the render result.**

### ❌ Don't do this:

```typescript
const { getByText, getByTestId } = render(<MyComponent />);
expect(getByText('Hello')).toBeTruthy();
```

### ✅ Do this instead:

```typescript
import { screen } from '@testing-library/react-native';

render(<MyComponent />);
expect(screen.getByText('Hello')).toBeTruthy();
```

### Why?

1. **Consistency** - Standard pattern across all modern Testing Library documentation
2. **No destructuring needed** - Cleaner code, fewer variables
3. **Better debugging** - `screen.debug()` works out of the box
4. **Future-proof** - Aligns with Testing Library best practices

## Test Structure

### Basic Template

```typescript
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../helpers/test-utils';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('should handle button press', () => {
    const mockFn = jest.fn();
    renderWithProviders(<MyComponent onPress={mockFn} />);

    fireEvent.press(screen.getByText('Submit'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### With Mock Hooks

```typescript
// At the top of file
jest.mock('@/hooks/useDevices', () => ({
  useDevices: jest.fn(),
}));

import { useDevices } from '@/hooks/useDevices';

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock return value
    (useDevices as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it('should display devices', () => {
    (useDevices as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Test Device' }],
      isLoading: false,
    });

    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Test Device')).toBeTruthy();
  });
});
```

### With Async Operations

```typescript
it('should handle async operation', async () => {
  renderWithProviders(<MyComponent />);

  fireEvent.press(screen.getByText('Load Data'));

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeTruthy();
  });
});
```

## Query Selection Priority

Use queries in this order of preference:

1. **getByText** - For text content
2. **getByTestId** - For elements without accessible text
3. **getByRole** - For accessible elements (buttons, etc.)
4. **UNSAFE_getByType** - As last resort for component types

```typescript
// Good - semantic queries
expect(screen.getByText('Submit')).toBeTruthy();
expect(screen.getByTestId('user-profile')).toBeTruthy();

// Avoid when possible
expect(screen.UNSAFE_getByType(TouchableOpacity)).toBeTruthy();
```

## Assertions

### Existence Checks

```typescript
// Element exists
expect(screen.getByText('Hello')).toBeTruthy();

// Element doesn't exist
expect(screen.queryByText('Hello')).toBeNull();
```

### Query vs Get vs Find

- **getBy\*** - Throws if not found (use for elements that should exist)
- **findBy\*** - Throws if not found (use for elements that should exist after finishing async event)
- **queryBy\*** - Returns null if not found (use for elements that might not exist)

```typescript
// Should exist - use getBy
expect(screen.getByText('Required Text')).toBeTruthy();

// Might not exist - use queryBy
expect(screen.queryByText('Optional Text')).toBeNull();
```

## Mock Data

Use shared mock data from `__tests__/helpers/mock-data.ts`:

```typescript
import { TEST_DEVICES, TEST_FREQUENCIES, EXPECTED_RESULTS } from '../helpers/mock-data';

it('should display device', () => {
  (useDevices as jest.Mock).mockReturnValue({
    data: [TEST_DEVICES.vtx],
  });

  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Test VTX Device')).toBeTruthy();
});
```

## Custom Render

Always use `renderWithProviders` from `test-utils.tsx` instead of plain `render`:

```typescript
import { renderWithProviders } from '../helpers/test-utils';

// Automatically includes QueryClient, ThemeProvider
renderWithProviders(<MyComponent />);

// With DeviceScreenContext
renderWithProviders(<MyComponent />, { withDeviceContext: true });
```

## Testing Context

For components that use context:

```typescript
import { DeviceScreenMode } from '@/contexts/DeviceScreenContext';

it('should show edit mode', () => {
  renderWithProviders(<MyComponent />, {
    withDeviceContext: true,
    deviceContextValue: { mode: DeviceScreenMode.EDIT }
  });

  expect(screen.getByText('Edit Mode')).toBeTruthy();
});
```

## Style Testing

**Don't test exact styles** - they're implementation details. Test behavior instead:

```typescript
// ❌ Don't do this
expect(element.props.style).toMatchObject({ color: '#000' });

// ✅ Do this - test that element exists (styles are applied via theme)
expect(screen.getByText('Styled Text')).toBeTruthy();
```

## Navigation Testing

Use `mockRouter` from `setup.ts`:

```typescript
import { mockRouter } from '../setup';

it('should navigate to device', () => {
  renderWithProviders(<MyComponent />);

  fireEvent.press(screen.getByText('Add Device'));

  expect(mockRouter.push).toHaveBeenCalledWith('/devices/add');
});
```

## Known Issues

### Act Warnings

Warnings from TanStack Query about updates not being wrapped in `act(...)` are expected and non-critical. They occur due to async state updates and can be safely ignored.

## Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Specific file
pnpm test SettingResult

# With coverage
pnpm test -- --coverage
```

## Example: Complete Test File

```typescript
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderWithProviders } from '../helpers/test-utils';
import { MyComponent } from '@/components/MyComponent';
import { TEST_DEVICES } from '../helpers/mock-data';

jest.mock('@/hooks/useDevices', () => ({
  useDevices: jest.fn(),
}));

import { useDevices } from '@/hooks/useDevices';

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useDevices as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  describe('Rendering', () => {
    it('should render empty state', () => {
      renderWithProviders(<MyComponent />);
      expect(screen.getByText('No devices')).toBeTruthy();
    });

    it('should render devices list', () => {
      (useDevices as jest.Mock).mockReturnValue({
        data: [TEST_DEVICES.vtx],
        isLoading: false,
      });

      renderWithProviders(<MyComponent />);
      expect(screen.getByText('Test VTX Device')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should handle device press', () => {
      const mockOnPress = jest.fn();

      renderWithProviders(<MyComponent onPress={mockOnPress} />);

      fireEvent.press(screen.getByText('Submit'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator', () => {
      (useDevices as jest.Mock).mockReturnValue({
        data: [],
        isLoading: true,
      });

      renderWithProviders(<MyComponent />);
      expect(screen.getByText('Loading...')).toBeTruthy();
    });
  });
});
```
