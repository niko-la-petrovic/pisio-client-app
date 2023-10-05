"use client";

import { useEffect } from "react";

export default function ClientThemeHandler() {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      console.debug("dark mode");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      console.debug("light mode");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.theme = "light";
    }
  }, []);
  return <></>;
}
