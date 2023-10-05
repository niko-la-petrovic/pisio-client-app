import { Link } from "@nextui-org/link";
import { menuBarItemGroups } from "@/constants/menuBarItemGroups";

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded bg-neutral-200 p-4 shadow">
      {menuBarItemGroups
        .flatMap((group) => group.items)
        .map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xl">{item.icon}</span>
            <Link color="foreground" href={item.href}>
              {item.label}
            </Link>
          </div>
        ))}
    </div>
  );
}
