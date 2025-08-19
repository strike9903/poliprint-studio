import { Palette, Zap, Shield, Clock, Star, ArrowRight, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { PopularCategories } from "@/components/sections/PopularCategories";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Benefits } from "@/components/sections/Benefits";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { SEOAccordion } from "@/components/sections/SEOAccordion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Popular Categories */}
        <PopularCategories />

        {/* Portfolio Gallery */}
        <Portfolio />

        {/* How It Works */}
        <HowItWorks />

        {/* Benefits */}
        <Benefits />

        {/* Testimonials */}
        <Testimonials />

        {/* Blog Preview */}
        <BlogPreview />

        {/* SEO Content */}
        <SEOAccordion />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;