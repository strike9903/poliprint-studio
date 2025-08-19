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
import { SEO } from "@/components/common/SEO";

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Poliprint Studio - Онлайн типографія 24/7"
        description="Професійний друк холстів, акрилу, поліграфії та мерчу. Завантажуйте макети онлайн, отримуйте готові вироби швидко та якісно."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Poliprint Studio",
          "url": "https://poliprint.ua",
          "description": "Онлайн типографія для друку холстів, акрилу, поліграфії",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "UA"
          }
        }}
      />
      
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
    </>
  );
}