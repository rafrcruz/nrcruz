import React from 'react';
import { Label, TextInput as FlowbiteTextInput } from 'flowbite-react';

const TextInput = React.forwardRef(
  ({ id, label, className = '', inputClassName = '', helperText, ...props }, ref) => (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label ? (
        <Label htmlFor={id} className="text-sm font-semibold text-slate-200">
          {label}
        </Label>
      ) : null}
      <FlowbiteTextInput
        id={id}
        ref={ref}
        className={`w-full ${inputClassName}`}
        color="info"
        {...props}
      />
      {helperText ? <p className="text-xs text-slate-400">{helperText}</p> : null}
    </div>
  ),
);

TextInput.displayName = 'TextInput';

export default TextInput;
