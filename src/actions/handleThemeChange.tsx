"use server";

import { cookies } from "next/headers";

export default async function handleThemeChange(theme: string) {
  const cookieStore = cookies();
  cookieStore.set("theme", theme, { path: "/", sameSite: "lax" });
}
