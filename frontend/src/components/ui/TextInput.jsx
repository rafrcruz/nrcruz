import React from 'react';
import PropTypes from 'prop-types';
import { Label, TextInput as FlowbiteTextInput } from 'flowbite-react';

const TextInput = React.forwardRef(
  ({ id, label, className = '', inputClassName = '', helperText, ...props }, ref) => (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label ? (
        <Label htmlFor={id} className="text-sm font-semibold text-neutral-100">
          {label}
        </Label>
      ) : null}
      <FlowbiteTextInput
        id={id}
        ref={ref}
        className={`w-full bg-neutral-900/50 text-neutral-100 placeholder-neutral-400 border border-neutral-500 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-60 ${inputClassName}`}
        color="info"
        {...props}
      />
      {helperText ? <p className="text-xs text-neutral-200">{helperText}</p> : null}
    </div>
  ),
);

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  helperText: PropTypes.string,
};

export default TextInput;
