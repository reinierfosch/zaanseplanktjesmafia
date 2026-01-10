import { TabId } from "@/types";
import { Button } from "@/components/ui/button";

interface HomeTabProps {
  onNavigate: (tab: TabId) => void;
  onZoomComplete?: () => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  // Verwijzingen naar jouw geüploade foto's
  const zaanseImages = [
    "/images/WhatsAppImage2025-12-26at18.45.30(1).jpeg", 
    "/images/WhatsAppImage2025-12-26at18.45.30(2).jpeg", 
    "/images/WhatsAppImage2025-12-26at18.45.30.jpeg",    
    "/images/WhatsAppImage2025-12-26at18.45.31(1).jpeg", 
  ];

  return (
    <div className="relative min-h-full flex flex-col items-center">
      
      {/* HERO SECTIE: De Collage */}
      <section className="w-full max-w-6xl mx-auto pt-12 pb-32 px-4 relative">
        
        {/* Titel */}
        <div className="relative z-20 text-center mb-16">
          <h1 className="text-7xl md:text-9xl mb-4 transform -rotate-2 text-foreground">
            Zaanse <span className="text-primary">Plankjes</span> Maffia
          </h1>
          <p className="text-2xl md:text-3xl transform rotate-1 text-muted-foreground">
            Iconische kunst op resthout • Puur Zaans
          </p>
        </div>

        {/* De Fotocollage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative h-auto md:h-[450px]">
          
          {/* Foto 1: Molen/Huisje met plakband */}
          <div className="relative transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10 md:top-8 group">
            <div className="tape-strip -top-4 left-10 rotate-3"></div>
            <div className="bg-white p-2 shadow-lg clip-torn-1 transition-transform group-hover:scale-105">
              <img 
                src={zaanseImages[0]} 
                alt="Zaanse Molen" 
                className="w-full h-64 object-cover charcoal-filter"
              />
            </div>
            <p className="text-xl mt-2 text-center rotate-2">Authentiek Zaans</p>
          </div>

          {/* Foto 2: Overzicht */}
          <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500 z-0 md:top-20">
             <div className="tape-strip -top-3 right-10 -rotate-12"></div>
            <div className="bg-white p-2 shadow-xl sketch-box">
              <img 
                src={zaanseImages[2]} 
                alt="Zaanse Huisjes" 
                className="w-full h-72 object-cover charcoal-filter"
              />
            </div>
          </div>

          {/* Foto 3: Straatje (uitgeknipt) */}
          <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-500 z-10 md:-top-4">
            <div className="bg-white p-2 shadow-lg clip-slice">
              <img 
                src={zaanseImages[3]} 
                alt="Zaans Straatje" 
                className="w-full h-64 object-cover charcoal-filter"
              />
            </div>
            <p className="text-lg text-right mt-2 -rotate-1 text-primary font-bold">#ZaansGroen</p>
          </div>

          {/* CTA "Notitieblaadje" */}
          <div className="relative transform rotate-3 z-20 md:top-10">
            <div className="bg-[#ffffeba0] p-6 shadow-md border border-gray-200 sketch-box rotate-1">
              <h3 className="text-3xl mb-2 border-b-2 border-primary/20 pb-2">Collectie</h3>
              <p className="mb-4 text-lg">
                Nieuwe unieke stukken van gered hout, rechtstreeks uit de streek.
              </p>
              <Button 
                onClick={() => onNavigate("gallery")}
                className="w-full text-xl py-6 btn-sketch"
              >
                Naar de Galerij &rarr;
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Intro Tekst */}
      <section className="max-w-3xl mx-auto px-6 text-center mb-20 relative">
        <div className="hidden md:block absolute left-0 top-0 w-full h-full border-l-2 border-r-2 border-dashed border-gray-300 opacity-30 pointer-events-none"></div>
        <h2 className="text-4xl md:text-5xl mb-6">Kunst met een rauw randje</h2>
        <p className="text-xl md:text-2xl leading-loose">
          Wij zijn de Zaanse Plankjes Maffia. Wij redden oud hout van de ondergang en geven het een tweede leven als kunstwerk. 
          Met potlood, inkt en een flinke dosis Zaanse nuchterheid vereeuwigen we onze streek.
        </p>
      </section>

    </div>
  );
}
