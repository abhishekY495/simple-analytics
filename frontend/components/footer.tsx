import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-2 p-4 px-5 dark:bg-neutral-800 dark:border-neutral-600 bg-neutral-100 border-t border-t-neutral-300">
      <p>
        Made by{" "}
        <Link
          href="https://x.com/abhishekY495"
          target="_blank"
          className="text-muted-foreground underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-[3px]"
        >
          Abhishek
        </Link>
      </p>
      <span className="text-muted-foreground">•</span>
      <Link
        href="https://github.com/abhishekY495/simple-analytics"
        target="_blank"
        className="text-muted-foreground underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-[3px]"
      >
        Source Code
      </Link>
    </footer>
  );
}
