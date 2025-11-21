import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'flowbite-react';

const BaseCard = ({ children, className = '', ...props }) => (
  <Card className={`w-full shadow-md backdrop-blur-sm ${className}`} {...props}>
    <div className="flex flex-col gap-3">{children}</div>
  </Card>
);

BaseCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default BaseCard;
