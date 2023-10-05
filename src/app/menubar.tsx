"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";

import { Link } from "@nextui-org/link";
import { menuBarItemGroups } from "@/constants/menuBarItemGroups";
import { useState } from "react";

export default function MenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="shadow">
      <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            {/* TODO logo */}
            <p className="font-bold text-inherit">Vector Similarity</p>
          </NavbarBrand>
        </NavbarContent>

        {/* TODO theme switcher */}
        <NavbarMenu>
          {menuBarItemGroups
            .flatMap((group) => group.items)
            .map((item, i) => (
              <NavbarMenuItem key={i}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </div>
              </NavbarMenuItem>
            ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
