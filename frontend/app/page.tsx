import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Simple Analytics</h1>

      <div className="flex gap-4">
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
        <Link href="/account">Account</Link>
      </div>

      <ThemeToggle />
    </div>
  );
}
