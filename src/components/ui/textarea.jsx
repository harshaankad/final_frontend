import React from "react";
import classNames from "classnames";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={classNames("field-textarea min-h-[80px]", className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
