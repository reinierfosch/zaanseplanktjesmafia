import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { TabId } from "@/types";

interface HomeTabProps {
  onNavigate: (tab: TabId) => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden"
      role="tabpanel"
      id="tabpanel-home"
      aria-labelledby="tab-home"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/workshop-hero-bg.jpg)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl space-y-8">
          {/* Main Headline */}
          <h1 className="text-7xl md:text-8xl font-black leading-tight text-white drop-shadow-lg">
            KUNST OP
            <br />
            <span className="text-yellow-400">PLANKJES</span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-md max-w-2xl leading-tight">
            Unieke kunstwerken op houten planken. Handgemaakt, origineel, en klaar om aan je muur te hangen.
          </p>

          {/* Decorative Line */}
          <div className="w-24 h-2 bg-yellow-400" aria-hidden="true"></div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => onNavigate("gallery")}
              className="bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-black text-lg px-8 py-6 uppercase flex items-center gap-2"
            >
              <ShoppingCart size={24} aria-hidden="true" />
              SHOP KUNSTWERKEN
            </Button>
            <Button
              onClick={() => onNavigate("contact")}
              variant="outline"
              className="border-4 border-white text-white hover:bg-white/10 font-black text-lg px-8 py-6 uppercase"
            >
              MEER INFORMATIE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

