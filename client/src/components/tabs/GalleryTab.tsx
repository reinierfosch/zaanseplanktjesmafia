import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderWizard } from "@/components/OrderWizard";
import { Feature, Artwork, ArtworkCategory, ProductType } from "@/types";
import { Shirt, Coffee, Book, Image as ImageIcon, Frame, Tag, ShoppingBag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const features: Feature[] = [
  {
    title: "Handgemaakt",
    desc: "Elk kunstwerk is uniek en met liefde gemaakt."
  },
  {
    title: "Origineel Design",
    desc: "Geen massaproductie. Echte kunstenaarskwaliteit."
  },
  {
    title: "Klaar om op te hangen",
    desc: "Ontvang je kunstwerk kant-en-klaar aan je deur."
  }
];

const categoryLabels: Record<ArtworkCategory, string> = {
  "grafische-kunst": "Grafische Kunst",
  "gedichten": "Gedichten",
  "tekst": "Tekst",
  "combinatie": "Combinatie",
};

const productTypeIcons: Record<ProductType, React.ComponentType<{ className?: string }>> = {
  tshirt: Shirt,
  mug: Coffee,
  notebook: Book,
  poster: ImageIcon,
  canvas: Frame,
  sticker: Tag,
  "tote-bag": ShoppingBag,
};

const productTypeLabels: Record<ProductType, string> = {
  tshirt: "T-shirt",
  mug: "Mok",
  notebook: "Notebook",
  poster: "Poster",
  canvas: "Canvas",
  sticker: "Sticker",
  "tote-bag": "Tote bag",
};

export function GalleryTab() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | undefined>();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/artworks");
      if (!response.ok) {
        throw new Error("Failed to fetch artworks");
      }
      const data = await response.json();
      setArtworks(data);
      // Initialize image loading state
      const loadingState = data.reduce(
        (acc: Record<string, boolean>, artwork: Artwork) => ({
          ...acc,
          [artwork.id]: true,
        }),
        {}
      );
      setImageLoading(loadingState);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setWizardOpen(true);
  };

  const handleImageError = (artworkId: string) => {
    setImageErrors(prev => ({ ...prev, [artworkId]: true }));
    setImageLoading(prev => ({ ...prev, [artworkId]: false }));
  };

  const handleImageLoad = (artworkId: string) => {
    setImageLoading(prev => ({ ...prev, [artworkId]: false }));
  };

  return (
    <>
      <OrderWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        artwork={selectedArtwork}
      />
      <section 
        className="relative min-h-screen py-24 bg-white"
        role="tabpanel"
        id="tabpanel-gallery"
        aria-labelledby="tab-gallery"
      >
        <div className="container space-y-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              KUNSTGALERIE
            </h2>
            <p className="text-lg font-mono text-gray-700">
              Ontdek onze collectie van handgemaakte kunstwerken op houten planken. 
              Bekijk voorbeelden van wat mogelijk is en bestel jouw eigen unieke kunstwerk.
            </p>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="industrial-box overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((artwork) => (
            <article 
              key={artwork.id}
              className="industrial-box overflow-hidden hover:shadow-2xl transition-all group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                {imageLoading[artwork.id] && !imageErrors[artwork.id] && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                {imageErrors[artwork.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <p className="text-gray-500 font-mono text-sm">Afbeelding niet beschikbaar</p>
                  </div>
                ) : (
                  <img 
                    src={`/images/${artwork.image}`}
                    alt={artwork.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      imageLoading[artwork.id] ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ transform: `rotate(${artwork.rotation ?? -90}deg)` }}
                    loading="lazy"
                    onError={() => handleImageError(artwork.id)}
                    onLoad={() => handleImageLoad(artwork.id)}
                  />
                )}
              </div>

              {/* Info */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase">{artwork.title}</h3>
                  {artwork.category && (
                    <span className="inline-block px-3 py-1 bg-gray-200 text-black text-xs font-black uppercase">
                      {categoryLabels[artwork.category]}
                    </span>
                  )}
                  {artwork.description && (
                    <p className="text-sm text-gray-700 font-mono">{artwork.description}</p>
                  )}
                  {artwork.availableProducts && artwork.availableProducts.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <TooltipProvider>
                        {artwork.availableProducts.map((productType) => {
                          const Icon = productTypeIcons[productType];
                          return (
                            <Tooltip key={productType}>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-center w-6 h-6 bg-gray-100 border border-gray-300 rounded">
                                  <Icon className="w-4 h-4 text-gray-700" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-mono text-xs">{productTypeLabels[productType]}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </TooltipProvider>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t-2 border-black">
                  <Button
                    onClick={() => handleOrderClick(artwork)}
                    className="w-full bg-black text-white hover:bg-gray-800 font-black px-4 py-2 uppercase text-sm"
                    aria-label={`Bestel ${artwork.title}`}
                  >
                    Bestel / Vraag Offerte
                  </Button>
                </div>
              </div>
            </article>
              ))}
            </div>
          )}

        {/* Why Choose Us */}
        <div className="border-t-4 border-black pt-12 mt-12">
          <h3 className="text-4xl font-black mb-8">WAAROM PLANKJES MAFFIA?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-2xl font-black uppercase text-orange-600">
                  {feature.title}
                </h4>
                <p className="font-mono text-lg text-gray-700 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

