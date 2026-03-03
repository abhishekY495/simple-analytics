import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-5 px-8">
        <Navbar />
        <div className="flex flex-col items-center gap-8 mt-12">
          <h1 className="text-6xl text-center font-bold leading-16 tracking-[-0.03em]">
            The modern analytics platform <br /> for effortless insights
          </h1>
          <p className="text-neutral-500 text-center dark:text-neutral-400">
            Simple Analytics makes it easy to collect and understand your
            website data — so you can focus on <b>growth</b>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="text-md rounded py-5 px-8 dark:bg-white text-black cursor-pointer dark:hover:bg-neutral-300 dark:text-black"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-md rounded py-5 px-8 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
