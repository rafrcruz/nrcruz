import React from 'react';
import PropTypes from 'prop-types';

// Lightweight structural wrapper powered by design tokens. Use it to build
// new layout blocks without reaching for hardcoded spacing, radius or colors.
const BaseContainer = ({ as: Component = 'main', children, className = '', ...props }) => (
  <Component
    className={`flex min-h-[calc(100vh-var(--app-shell-header-height,0px))] w-full items-center justify-center gap-md rounded-md border border-neutral-800/20 bg-neutral-900/10 px-xl py-2xl text-2xl font-semibold text-neutral-100 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

BaseContainer.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default BaseContainer;
