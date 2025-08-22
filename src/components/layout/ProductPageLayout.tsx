"use client";

import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info } from 'lucide-react';

interface ProductPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeIcon?: string;
  heroGradient?: string;
  seoContent?: {
    title: string;
    content: string;
    features?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

export function ProductPageLayout({ 
  children, 
  title, 
  subtitle, 
  badgeText, 
  badgeIcon = "🛍️",
  heroGradient = "from-slate-50 via-blue-50 to-indigo-50",
  seoContent 
}: ProductPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      {/* Compact Hero Section - Product Focus */}
      <section className={`relative bg-gradient-to-br ${heroGradient} py-8 sm:py-12 lg:py-16`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1),transparent_50%)] opacity-60"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="bg-gradient-to-r from-slate-700 to-blue-600 text-white border-0 shadow-lg mb-4">
            {badgeIcon} {badgeText}
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Product Content */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </section>

      {/* SEO Content Section - Collapsible */}
      {seoContent && (
        <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50/50 to-gray-100/30 border-t border-gray-200/50">
          <div className="container mx-auto px-4">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full max-w-2xl mx-auto flex items-center justify-between p-6 rounded-xl border-gray-200 hover:bg-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-lg">{seoContent.title}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-sm">
                    {/* Features Grid */}
                    {seoContent.features && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {seoContent.features.map((feature, index) => (
                          <div key={index} className="text-center p-4 bg-gray-50/50 rounded-xl">
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* SEO Text */}
                    <div className="prose prose-gray max-w-none">
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: seoContent.content }}
                      />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>
      )}
    </div>
  );
}
