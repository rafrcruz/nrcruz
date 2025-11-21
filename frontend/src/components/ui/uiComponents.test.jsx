import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import BaseCard from './BaseCard';
import PrimaryButton from './PrimaryButton';
import TextInput from './TextInput';
import * as uiIndex from './index';

vi.mock('flowbite-react', () => {
  const Card = ({ children, className, ...props }) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  );

  const Button = React.forwardRef(({ children, ...props }, ref) => (
    <button data-testid="button" ref={ref} {...props}>
      {children}
    </button>
  ));

  const Label = ({ children, ...props }) => (
    <label data-testid="label" {...props}>
      {children}
    </label>
  );

  const TextInput = React.forwardRef(({ className, ...props }, ref) => (
    <input data-testid="input" ref={ref} className={className} {...props} />
  ));

  return { Card, Button, Label, TextInput };
});

describe('UI components', () => {
  it('renders BaseCard with provided children and classes', () => {
    render(
      <BaseCard className="custom-card" data-extra="yes">
        <span>Inside card</span>
      </BaseCard>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-md');
    expect(card).toHaveClass('custom-card');
    expect(card).toHaveAttribute('data-extra', 'yes');
    expect(screen.getByText('Inside card')).toBeInTheDocument();
  });

  it('renders PrimaryButton with forwarded ref and classes', () => {
    const ref = createRef();
    render(<PrimaryButton ref={ref}>Click me</PrimaryButton>);

    const button = screen.getByTestId('button');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('sm:w-auto');
    expect(button).toHaveTextContent('Click me');
    expect(ref.current).toBe(button);
  });

  it('renders TextInput with label and helper text', () => {
    const ref = createRef();
    render(
      <TextInput
        id="username"
        ref={ref}
        label="User"
        helperText="Helpful text"
        className="container"
        inputClassName="input-class"
      />,
    );

    const input = screen.getByTestId('input');
    expect(screen.getByTestId('label')).toHaveAttribute('for', 'username');
    expect(screen.getByText('Helpful text')).toBeInTheDocument();
    expect(input).toHaveClass('input-class');
    expect(ref.current).toBe(input);
  });

  it('exposes components through the index file', () => {
    expect(uiIndex.BaseCard).toBe(BaseCard);
    expect(uiIndex.PrimaryButton).toBe(PrimaryButton);
    expect(uiIndex.TextInput).toBe(TextInput);
  });
});
