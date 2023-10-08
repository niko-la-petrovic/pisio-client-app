"use client";

import { useEffect, useState } from "react";

export default function useClientTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    let localStorageTheme = localStorage?.getItem("theme");
    setTheme(localStorageTheme === "light" ? "light" : "dark");
  }, []);
  return theme;
}
