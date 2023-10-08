"use client";

import { Link } from "@nextui-org/link";
import { menuBarItemGroups } from "@/constants/menuBarItemGroups";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div
      className="
        hidden h-full flex-col gap-4 overflow-hidden rounded bg-neutral-100 p-4  shadow
          dark:bg-zinc-900 sm:flex"
    >
      {menuBarItemGroups
        .flatMap((group) => group.items)
        .map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Link
              color="foreground"
              href={item.href}
              isBlock
              className={
                `w-full` +
                (pathname === item.href
                  ? " font-semibold text-sky-700 dark:text-sky-500"
                  : "")
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
