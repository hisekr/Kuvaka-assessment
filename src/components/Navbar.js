"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      updateHtmlClass(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
      updateHtmlClass(prefersDark);
    }
  }, []);

  const updateHtmlClass = (dark) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newDark = !prev;
      localStorage.setItem("theme", newDark ? "dark" : "light");
      updateHtmlClass(newDark);
      return newDark;
    });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[var(--background)] text-[var(--foreground)] shadow-md">
      <div className="text-xl font-semibold bg-[var(--background)] text-[var(--foreground)]">
        Kuvaka x Gemini
      </div>

      <button
        onClick={toggleDarkMode}
        aria-label="Toggle Dark Mode"
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        {isDark ? <FiSun size={24} /> : <FiMoon size={24} />}
      </button>
    </nav>
  );
}
