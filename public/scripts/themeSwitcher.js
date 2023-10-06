(function () {
  const selectedDarkTheme = localStorage.theme === "dark";
  const selectedAnyTheme = "theme" in localStorage;
  const browserPrefersDarkTheme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const prefersDarkTheme =
    selectedDarkTheme || (!selectedAnyTheme && browserPrefersDarkTheme);

  if (prefersDarkTheme) {
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
})();
