import { ModernLayout } from '@/components/layout/ModernLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { PopularCategories } from '@/components/sections/PopularCategories';
import { Benefits } from '@/components/sections/Benefits';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Portfolio } from '@/components/sections/Portfolio';
import { Testimonials } from '@/components/sections/Testimonials';
import { BlogPreview } from '@/components/sections/BlogPreview';
import { OrganizationSchema, WebSiteSchema, BreadcrumbSchema } from '@/components/seo';
import { generateMetadata as generateSEOMetadata, defaultMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

interface HomePageProps {
  params: { locale: string };
}

// Generate metadata for the home page
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = params;
  
  return generateSEOMetadata({
    ...defaultMetadata.home,
    url: `/${locale}`,
    locale,
    alternateLocales: ['uk', 'ru'],
    type: 'website'
  });
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  return (
    <>
      {/* SEO Structured Data */}
      <OrganizationSchema
        contactPoint={{
          telephone: '+380443334455',
          contactType: 'customer service',
          email: 'info@poliprint.com.ua',
          availableLanguage: ['uk', 'ru', 'en']
        }}
        address={{
          streetAddress: 'вул. Поліграфічна, 15',
          addressLocality: 'Київ',
          addressRegion: 'Київська область',
          postalCode: '03057',
          addressCountry: 'UA'
        }}
        sameAs={[
          'https://www.facebook.com/poliprint',
          'https://www.instagram.com/poliprint',
          'https://t.me/poliprint',
          'https://www.linkedin.com/company/poliprint'
        ]}
        geo={{
          latitude: 50.4501,
          longitude: 30.5234
        }}
      />
      
      <WebSiteSchema
        inLanguage={[locale, locale === 'uk' ? 'ru' : 'uk']}
        potentialAction={{
          searchUrl: `/${locale}/search?q={search_term_string}`,
          queryInput: 'required name=search_term_string'
        }}
      />

      <BreadcrumbSchema 
        items={[
          { name: locale === 'uk' ? 'Головна' : 'Главная', url: `/${locale}`, position: 1 }
        ]} 
      />

      <ModernLayout locale={locale} variant="wide" className="p-0">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Popular Categories */}
        <PopularCategories />
        
        {/* Benefits */}
        <Benefits />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Portfolio */}
        <Portfolio />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* Blog Preview */}
        <BlogPreview />
      </ModernLayout>
    </>
  );
}