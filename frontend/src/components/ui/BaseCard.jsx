import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'flowbite-react';

// Structural card that uses spacing, border, radius and neutral palette tokens
// so new cards can reuse the same base look without duplicating raw values.
const BaseCard = ({ children, className = '', ...props }) => (
  <Card
    className={`w-full rounded-lg border border-neutral-800 bg-neutral-900/60 p-lg shadow-md backdrop-blur-sm ${className}`}
    {...props}
  >
    <div className="flex flex-col gap-md text-neutral-100">{children}</div>
  </Card>
);

BaseCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default BaseCard;
