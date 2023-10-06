"use client";

import { cookies } from "next/headers";
import handleThemeChange from "@/actions/handleThemeChange";
import { useEffect } from "react";

export default function ClientThemeHandler() {
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
    } else {
      console.debug("light mode");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      theme = localStorage.theme = "light";
    }
    handleThemeChange(theme);
  }, []);
  return <></>;
}
