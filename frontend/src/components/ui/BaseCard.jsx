import React from 'react';
import { Card } from 'flowbite-react';

const BaseCard = ({ children, className = '', ...props }) => (
  <Card className={`w-full shadow-md backdrop-blur-sm ${className}`} {...props}>
    <div className="flex flex-col gap-3">{children}</div>
  </Card>
);

export default BaseCard;
