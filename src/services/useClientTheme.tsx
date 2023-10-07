"use client";

export default function useClientTheme() {
  let localStorageTheme = localStorage.getItem("theme");

  return localStorageTheme === "light" ? "light" : "dark";
}
