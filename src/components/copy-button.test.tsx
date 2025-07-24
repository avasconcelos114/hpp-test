import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CopyButton } from './copy-button';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('CopyButton', () => {
  it('should render', () => {
    const screen = render(
      <CopyButton text='test' testId='test' ariaLabel='test' />,
    );
    expect(screen.getByTestId('copy-button-test')).toMatchSnapshot();
  });

  it('should copy text to clipboard', () => {
    const screen = render(
      <CopyButton text='test' testId='test' ariaLabel='test' />,
    );
    const button = screen.getByTestId('copy-button-test');
    fireEvent.click(button);
    expect(button.textContent).toBe('Copied!');
  });

  it('should reset text after timeout', async () => {
    vi.useFakeTimers();
    const screen = render(
      <CopyButton text='test' testId='test' ariaLabel='test' />,
    );
    const button = screen.getByTestId('copy-button-test');
    fireEvent.click(button);
    expect(button.textContent).toBe('Copied!');

    // Advance timers and flush React updates
    await act(async () => {
      vi.advanceTimersByTime(6000); // or whatever your timeout is
    });

    expect(button.textContent).toBe('Copy');
    vi.useRealTimers();
  });
});
