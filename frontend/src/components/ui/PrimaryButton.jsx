import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'flowbite-react';

const PrimaryButton = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <Button ref={ref} color="blue" className={`w-full sm:w-auto ${className}`} {...props}>
    {children}
  </Button>
));

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
