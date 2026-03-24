import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  const features = [
    {
      name: "Traffic sources",
      description:
        "See where your traffic is coming from to better understand where you should be spending your effort.",
      imagePath: "/home-page/features/traffic-sources.png",
    },
    {
      name: "Visitor analysis",
      description:
        "Identify your top audience and where your visitors are coming from with country-level insights.",
      imagePath: "/home-page/features/visitor-analysis.png",
    },
    {
      name: "Traffic analysis",
      description:
        "Quickly get a complete snapshot of your website performance with key metrics like visitors, visits, pageviews, and average visit duration all in one place.",
      imagePath: "/home-page/features/traffic-analysis.png",
      fullWidth: true,
    },
    {
      name: "Environment",
      description:
        "See the most popular browsers, operating systems, and devices used by visitors to help you optimize your pages.",
      imagePath: "/home-page/features/environment.png",
    },
    {
      name: "Live visitors",
      description:
        "Get a realtime view of your current website traffic. See where your visitors are coming from in real-time.",
      imagePath: "/home-page/features/live-visitors.png",
    },
    {
      name: "📢 Share analytics",
      description:
        "Easily share your analytics with others by using a public link. By default your website's metrics are private. When you want to share analytics, you can share a public link with others. The analytics of <a href='https://bugbountydirectory.com' target='_blank' style='color: #007bff; text-decoration: 1px solid underline; font-weight: 500; text-underline-offset: 4px;'>Bug Bounty Directory</a> is public and can be viewed <a href='https://simple-analytics-495.vercel.app/public/b23a0826-6452-4d23-8f59-28718677223a' target='_blank' style='color: #007bff; text-decoration: 1px solid underline; font-weight: 500; text-underline-offset: 4px;'>here</a>",
      fullWidth: true,
    },
  ];

  return (
    <section className="flex flex-col items-center gap-12 mt-5">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold">✨ Features</h2>
        <p className="text-neutral-500 text-center dark:text-neutral-400">
          Simple Analytics is packed with amazing features that enable you to
          better understand your website traffic.{" "}
          <br className="hidden md:block" /> A complete analytics solution with
          all the features you need.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {features.map((feature) => (
          <Card
            key={feature.name}
            className={cn(
              "rounded border gap-0 bg-neutral-50/50 dark:bg-neutral-900 shadow-none px-2 pb-8",
              feature.fullWidth && "md:col-span-2 col-span-1",
            )}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold dark:text-neutral-200">
                {feature.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
              {feature.imagePath && (
                <Image
                  src={feature.imagePath}
                  alt={feature.name}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
