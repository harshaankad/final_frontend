import React from "react";

export function NavigationMenu({ children, className = "", ...props }) {
  return (
    <nav className={className} {...props}>
      {children}
    </nav>
  );
}

export function NavigationMenuList({ children, className = "", ...props }) {
  return (
    <ul className={`flex list-none p-0 m-0 ${className}`} {...props}>
      {children}
    </ul>
  );
}

export function NavigationMenuItem({ children, className = "", ...props }) {
  return (
    <li className={className} {...props}>
      {children}
    </li>
  );
}

export function NavigationMenuLink({ children, className = "", ...props }) {
  return (
    <a href="#" className={`cursor-pointer ${className}`} {...props}>
      {children}
    </a>
  );
}
