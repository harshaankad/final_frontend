import React from "react";
import clsx from "clsx";

export const Table = ({ children, className }) => (
  <table className={clsx("w-full text-left border-collapse", className)}>
    {children}
  </table>
);

export const TableHeader = ({ children, className }) => (
  <thead className={clsx("bg-gray-100", className)}>{children}</thead>
);

export const TableRow = ({ children, className }) => (
  <tr className={clsx("border-b last:border-0", className)}>{children}</tr>
);

export const TableHead = ({ children, className }) => (
  <th className={clsx("p-4 text-gray-500 text-xs uppercase", className)}>
    {children}
  </th>
);

export const TableBody = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableCell = ({ children, className }) => (
  <td className={clsx("p-4 align-middle", className)}>{children}</td>
);
