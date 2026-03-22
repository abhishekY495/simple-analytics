import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-center p-3 pb-3.5 border-b bg-neutral-100 dark:bg-neutral-800">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/app-icon.png" alt="logo" width={20} height={20} />
          <p className="font-semibold text-sm truncate">Simple Analytics</p>
        </Link>
      </header>
      <div className="flex-1 xl:p-8 p-5 px-6 max-w-7xl mx-auto w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}
