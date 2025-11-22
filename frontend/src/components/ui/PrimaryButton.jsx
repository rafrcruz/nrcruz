import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'flowbite-react';

const PrimaryButton = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <Button
    ref={ref}
    color="primary"
    className={`w-full sm:w-auto font-semibold text-white transition-colors duration-150 focus-visible:ring-4 focus-visible:ring-primary-200 focus-visible:outline-none hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </Button>
));

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
