import React from "react";
import clsx from "clsx";

export const Badge = ({ className, children }) => {
  return (
    <span
      className={clsx(
        "inline-block rounded-full text-center text-xs font-medium px-2.5 py-1",
        className
      )}
    >
      {children}
    </span>
  );
};
