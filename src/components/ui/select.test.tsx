import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './select';

describe('Select', () => {
  it('should render the select', () => {
    render(<Select options={[]} data-testid='select' />);
    expect(screen.getByTestId('select')).toMatchSnapshot();
  });

  it('renders options correctly', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    render(<Select options={options} data-testid='select' />);
    const select = screen.getByTestId('select');
    expect(select.children.length).toBe(2);
    expect(screen.getByText('Option 1')).toBeDefined();
    expect(screen.getByText('Option 2')).toBeDefined();
  });

  it('renders label properly', () => {
    render(<Select label='My Label' options={[]} data-testid='select' />);
    expect(screen.getByText('My Label')).toBeDefined();
  });

  it('renders helperText and associates it with select', () => {
    render(<Select helperText='Help me' options={[]} data-testid='select' />);
    expect(screen.getByText('Help me')).toBeDefined();
    const select = screen.getByTestId('select');
    const help = screen.getByText('Help me');
    expect(select.getAttribute('aria-describedby')).toBe(help.id);
  });

  it('calls onChange when value changes', () => {
    const options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];
    const handleChange = vi.fn();
    render(
      <Select options={options} onChange={handleChange} data-testid='select' />,
    );
    const select = screen.getByTestId('select');
    fireEvent.change(select, { target: { value: 'b' } });
    expect(handleChange).toHaveBeenCalled();
    expect((select as HTMLSelectElement).value).toBe('b');
  });

  it('renders with custom class names', () => {
    render(
      <Select options={[]} className='custom-class' data-testid='select' />,
    );
    const select = screen.getByTestId('select');
    expect(select.className).toContain('custom-class');
  });
});
