import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex items-center justify-center py-2">
      <Link href="/" className="flex items-center gap-2 p-3 px-6 rounded dark:bg-neutral-800 dark:hover:bg-neutral-700/80 bg-neutral-100 hover:bg-neutral-200/50">
        <Image src="/app-icon.png" alt="logo" width={28} height={28} />
        <h1 className="text-2xl font-bold">
          Simple Analytics
        </h1>
      </Link>
    </nav>
  );
}