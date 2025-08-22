import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";

export const metadata = {
  title: "Політика конфіденційності - Poliprint Studio",
  description: "Політика обробки персональних даних",
  robots: { index: false }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <Badge className="bg-warning/10 text-warning border-warning/20 mb-4">Скоро</Badge>
          <h1 className="text-4xl font-heading font-bold mb-4">Політика конфіденційності</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Готуємо детальну політику конфіденційності згідно з українським та європейським законодавством.
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
