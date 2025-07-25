import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render the button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('should have default variant and size classes', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-bvnk-primary');
  });

  it('should have ghost variant class', () => {
    render(<Button variant='ghost'>Ghost</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('hover:bg-accent');
    expect(btn.className).toContain('hover:text-accent-foreground');
  });

  it('should have link variant class', () => {
    render(<Button variant='link'>Link</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('text-primary');
    expect(btn.className).toContain('hover:underline');
  });

  it('should have small size class', () => {
    render(<Button size='sm'>Small</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-8');
    expect(btn.className).toContain('px-3');
  });

  it('should have large size class', () => {
    render(<Button size='lg'>Large</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-10');
    expect(btn.className).toContain('px-6');
  });

  it('should have icon size class', () => {
    render(<Button size='icon'>Icon</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('size-9');
  });
});
