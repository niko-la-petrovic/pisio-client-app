import { ReactNode } from "react";

export type MenuItem = {
  label: string;
  icon?: ReactNode;
  href: string;
};

export type MenuItemGroup = {
  label?: string;
  items: MenuItem[];
};
