import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HeroImage } from "@/components/home/hero-image";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { OpenSourceSection } from "@/components/home/open-source-section";
import { SimpleSetupSection } from "@/components/home/simple-setup-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-5 px-8 pb-28">
        <Navbar />
        <HeroSection />
        <HeroImage />
        <FeaturesSection />
        <SimpleSetupSection />
        <OpenSourceSection />
      </div>
      <Footer />
    </div>
  );
}
