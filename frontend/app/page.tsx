import { Footer } from "@/components/footer";
import { HeroImage } from "@/components/home/hero-image";
import { HeroSection } from "@/components/home/hero-section";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-5 px-8">
        <Navbar />

        <HeroSection />

        <HeroImage />
      </div>
      <Footer />
    </div>
  );
}
