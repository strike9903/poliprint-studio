import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";

export const metadata = {
  title: "Умови використання - Poliprint Studio",
  description: "Умови надання послуг друку",
  robots: { index: false }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <Badge className="bg-warning/10 text-warning border-warning/20 mb-4">Скоро</Badge>
          <h1 className="text-4xl font-heading font-bold mb-4">Умови використання</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Готуємо умови надання послуг друку та правила користування сайтом.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" />На головну</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
