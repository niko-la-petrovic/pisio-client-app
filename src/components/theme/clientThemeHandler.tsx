"use client";

import { useEffect, useState } from "react";

import handleThemeChange from "@/actions/handleThemeChange";

export default function ClientThemeHandler() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    let theme = "dark";
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      console.debug("dark mode");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      theme = localStorage.theme = "dark";
      setTheme("dark");
    } else {
      console.debug("light mode");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      theme = localStorage.theme = "light";
      setTheme("light");
    }
    handleThemeChange(theme);
  }, []);
  return <></>;
}
