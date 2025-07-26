import React from 'react';
import { render, act } from '@testing-library/react';
import { vi, expect, describe, it } from 'vitest';
import { useFocusOnNavigation } from './useFocusOnNavigation';

describe('useFocusOnNavigation', () => {
  let originalFocus: () => void;

  beforeEach(() => {
    // Save the original focus method
    originalFocus = document.body.focus;
    // Spy on the focus method
    document.body.focus = vi.fn();
    document.body.tabIndex = 0;
  });

  afterEach(() => {
    // Restore the original focus method
    document.body.focus = originalFocus;
  });

  vi.mock('next/navigation', () => ({
    usePathname: vi.fn().mockReturnValue('/payin/123'),
    useSearchParams: vi.fn().mockReturnValue({}),
  }));

  function TestComponent() {
    useFocusOnNavigation();
    return null;
  }

  it('should focus on the body when the page is navigated to', () => {
    render(<TestComponent />);
    expect(document.body.focus).toHaveBeenCalledTimes(1);
  });

  it('should focus again when the pathname changes', async () => {
    const { rerender } = render(<TestComponent />);
    expect(document.body.focus).toHaveBeenCalledTimes(1);
    const { usePathname } = await import('next/navigation');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      '/payin/123/pay',
    );

    act(() => {
      rerender(<TestComponent />);
    });
    expect(document.body.focus).toHaveBeenCalledTimes(2);
  });
});
