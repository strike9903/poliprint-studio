"use client";

import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useParams } from "next/navigation";

export const BlogPreview = () => {
  const params = useParams();
  const locale = params.locale as string || 'uk';
  const blogPosts = [
    {
      id: 1,
      title: "Як підготувати макет для друку: повний гайд 2024",
      excerpt: "Детальна інструкція з підготовки файлів для якісного друку. Формати, роздільна здатність, вилети та інші важливі нюанси.",
      image: "📄",
      category: "Поради",
      author: "Олексій Друкар",
      date: "15 грудня 2024",
      readTime: "8 хв читання",
      slug: "jak-pidgotuvaty-maket-dlja-druku"
    },
    {
      id: 2,
      title: "DTF друк проти традиційного: що обрати для футболок?",
      excerpt: "Порівняння сучасної технології DTF з класичними методами друку на текстилі. Переваги, недоліки та область застосування.",
      image: "👕",
      category: "Технології",
      author: "Марина Текстиль",
      date: "12 грудня 2024", 
      readTime: "6 хв читання",
      slug: "dtf-druk-proty-tradycijnogo"
    },
    {
      id: 3,
      title: "Холст чи акрил: що краще для фотодруку?",
      excerpt: "Детальне порівняння матеріалів для друку фотографій. Коли обирати холст, а коли акрил залежно від стилю та призначення.",
      image: "🖼️",
      category: "Матеріали",
      author: "Ірина Фото",
      date: "10 грудня 2024",
      readTime: "5 хв читання", 
      slug: "holst-chy-akryl-shho-krashhe"
    }
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
            Корисні статті
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Блог про друк
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Корисні поради, гайди та останні новини зі світу професійного друку. Допомагаємо створювати якісні макети.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className="card-product group animate-fade-in h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-primary relative overflow-hidden">
                <div className="absolute inset-4 bg-surface rounded-lg border border-border/20 flex items-center justify-center">
                  <span className="text-6xl opacity-80">{post.image}</span>
                </div>
                
                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 bg-background/80 text-foreground border-border/50">
                  {post.category}
                </Badge>
              </div>

              <CardContent className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-lg font-heading font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    
                    <Button size="sm" variant="ghost" className="group/btn text-xs" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Читати
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="btn-hero-outline" asChild>
            <Link href="/blog">
              Дивитись всі статті
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};