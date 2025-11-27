import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'flowbite-react';

// Base button aligned with the design tokens so future variants can extend
// the same spacing, typography, borders and state colors without hardcoded values.
const PrimaryButton = forwardRef(({ children, className = '', ...props }, ref) => {
  const baseClasses = [
    'inline-flex w-full items-center justify-center gap-sm',
    'rounded-md border border-primary-600 bg-primary-600 px-xl py-sm',
    'font-semibold text-base text-neutral-50',
    'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus',
    'hover:bg-primary-600 hover:brightness-95 active:bg-primary-700',
    'disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:text-neutral-200 disabled:opacity-80 sm:w-auto',
  ];

  return (
    <Button
      ref={ref}
      color="primary"
      className={`${baseClasses.join(' ')} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
});

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
