import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

export function OpenSourceSection() {
  return (
    <section className="flex flex-col items-center gap-12 mt-28">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="https://icons.duckduckgo.com/ip3/opensource.org.ico"
            alt="Open Source"
            width={35}
            height={35}
          />
          <h2 className="text-4xl font-bold">Open Source</h2>
        </div>
        <p className="text-neutral-500 text-center dark:text-neutral-400">
          Simple Analytics is free and open source. <br /> Thousands of
          developers worldwide can share and contribute to the Simple Analytics
          experience.
        </p>
        <Link
          href="https://github.com/abhishekY495/simple-analytics"
          target="_blank"
        >
          <Button
            className="text-md rounded py-5 px-8 cursor-pointer bg-muted"
            variant="outline"
          >
            View on GitHub
          </Button>
        </Link>
      </div>
    </section>
  );
}
