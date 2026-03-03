"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      className="w-fit rounded px-6 cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div className="flex items-center gap-2 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span>Light</span>
      </div>
      <div className="flex items-center gap-2 absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0">
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span>Dark</span>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
