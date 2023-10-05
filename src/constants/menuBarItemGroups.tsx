import {
  AiOutlineDashboard,
  AiOutlineDatabase,
  AiOutlineFileSearch,
  AiOutlineGroup,
  AiOutlineImport,
} from "react-icons/ai";

import { MenuItemGroup } from "@/types/menu";

export const menuBarItemGroups: MenuItemGroup[] = [
  {
    label: "Insight",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: <AiOutlineDashboard />,
      },
      {
        label: "Collections",
        href: "/collection",
        icon: <AiOutlineGroup />,
      },
      {
        label: "Vectors",
        href: "/vector",
        icon: <AiOutlineDatabase />,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Similarity",
        href: "/similarity",
        icon: <AiOutlineFileSearch />,
      },
      {
        label: "Import",
        href: "/import",
        icon: <AiOutlineImport />,
      },
    ],
  },
];
