import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-5 p-4 px-5 dark:bg-neutral-800 dark:border-neutral-600 bg-neutral-100 border-t border-t-neutral-300">
      <ThemeToggle />
    </footer>
  );
}