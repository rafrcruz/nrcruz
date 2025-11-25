import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import BaseCard from './BaseCard';
import BaseContainer from './BaseContainer';
import PrimaryButton from './PrimaryButton';
import TextInput from './TextInput';
import * as uiIndex from './index';

/* eslint-disable jsx-a11y/label-has-for */
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

  const Label = ({ children, htmlFor = 'mock-control', ...props }) => (
    <label data-testid="label" htmlFor={htmlFor} {...props}>
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
      </BaseCard>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-neutral-800');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('p-lg');
    expect(card).toHaveClass('custom-card');
    expect(card).toHaveAttribute('data-extra', 'yes');
    expect(screen.getByText('Inside card')).toBeInTheDocument();
  });

  it('renders PrimaryButton with forwarded ref and classes', () => {
    const ref = createRef();
    render(<PrimaryButton ref={ref}>Click me</PrimaryButton>);

    const button = screen.getByTestId('button');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('px-xl');
    expect(button).toHaveClass('py-sm');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('sm:w-auto');
    expect(button).toHaveTextContent('Click me');
    expect(ref.current).toBe(button);
  });

  it('renders BaseContainer using design-token driven styles', () => {
    render(
      <BaseContainer data-extra="container" className="custom-container">
        <span>Inside container</span>
      </BaseContainer>
    );

    const container = screen.getByText('Inside container').parentElement;
    expect(container).toHaveClass('px-xl');
    expect(container).toHaveClass('py-2xl');
    expect(container).toHaveClass('border-neutral-800/20');
    expect(container).toHaveClass('rounded-md');
    expect(container).toHaveAttribute('data-extra', 'container');
    expect(container).toHaveClass('custom-container');
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
      />
    );

    const input = screen.getByTestId('input');
    expect(screen.getByTestId('label')).toHaveAttribute('for', 'username');
    expect(screen.getByText('Helpful text')).toBeInTheDocument();
    expect(input).toHaveClass('input-class');
    expect(ref.current).toBe(input);
  });

  it('renders TextInput without optional label or helper text', () => {
    render(<TextInput id="email" placeholder="Email" />);

    expect(screen.queryByTestId('label')).toBeNull();
    expect(screen.queryByText(/help/i)).toBeNull();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('exposes components through the index file', () => {
    expect(uiIndex.BaseCard).toBe(BaseCard);
    expect(uiIndex.BaseContainer).toBe(BaseContainer);
    expect(uiIndex.PrimaryButton).toBe(PrimaryButton);
    expect(uiIndex.TextInput).toBe(TextInput);
  });
});
