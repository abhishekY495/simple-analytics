import Link from "next/link";
import { Button } from "../ui/button";

export function SimpleSetupSection() {
  const steps = [
    {
      title: "Sign up",
      description: "Create a free account on Simple Analytics.",
    },
    {
      title: "Add tracking code",
      description: "Add the tracking code to your website.",
    },
    {
      title: "View your data",
      description: "Data will start appearing on your dashboard.",
      fullWidth: true,
    },
  ];
  return (
    <section className="flex flex-col items-center gap-10 mt-28">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold">⚒️ Simple Setup</h2>
        <p className="text-neutral-500 text-center dark:text-neutral-400">
          Simple Analytics is easy to set up and use. <br /> Follow the below
          steps to get started in minutes.
        </p>
      </div>
      <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-18">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col items-center justify-center gap-2"
          >
            <span className="font-semibold p-3 rounded-full border bg-muted text-muted-foreground w-10 h-10 flex items-center justify-center">
              {index + 1}
            </span>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="text-muted-foreground text-sm text-center">
              {step.description}
            </p>
          </div>
        ))}
      </div>
      <Link href="/signup">
        <Button className="text-md rounded py-5 px-8 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white">
          Get Started
        </Button>
      </Link>
    </section>
  );
}
