import { HeroSection } from "@/components/sections/HeroSection";
import { PopularCategories } from "@/components/sections/PopularCategories";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Benefits } from "@/components/sections/Benefits";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { SEOAccordion } from "@/components/sections/SEOAccordion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return [{ locale: "ua" }, { locale: "ru" }];
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PopularCategories />
        <Portfolio />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <BlogPreview />
        <SEOAccordion />
      </main>
      <Footer />
    </div>
  );
}
