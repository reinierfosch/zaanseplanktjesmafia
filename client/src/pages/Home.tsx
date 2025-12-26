import { Button } from "@/components/ui/button";
import { ChevronDown, Hammer, Palette, Users, ShoppingBag } from "lucide-react";

/**
 * Zaanse Planktjes Mafia - Business Landing Page
 * Artwork on Recycled Wooden Planks
 * Design Philosophy: Gritty street art aesthetic with authentic, raw energy
 * Combined figures as hero visual, placeholder sections for art, products, contact, workshops
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-2 border-foreground">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/images/qr-code-design.png" 
              alt="Zaanse Planktjes Mafia" 
              className="h-12 w-12 object-cover"
            />
            <div>
              <h1 className="text-xl font-bold tracking-widest leading-none">ZAANSE</h1>
              <p className="text-xs text-primary font-bold">PLANKTJES MAFIA</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#art" className="text-sm font-bold uppercase hover:text-primary transition-colors">Art</a>
            <a href="#products" className="text-sm font-bold uppercase hover:text-primary transition-colors">Products</a>
            <a href="#workshops" className="text-sm font-bold uppercase hover:text-primary transition-colors">Workshops</a>
            <a href="#contact" className="text-sm font-bold uppercase hover:text-primary transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section - Combined Figures */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
        </div>

        <div className="container relative z-10 grid md:grid-cols-2 gap-12 items-center py-20">
          {/* Left Content - Bold Typography */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black leading-tight">
                STREET ART
                <br />
                ON <span className="text-primary">RECYCLED</span>
                <br />
                WOOD
              </h1>
              <p className="text-xl text-gray-300 font-light max-w-md leading-relaxed">
                Handcrafted artwork on authentic recycled wooden planks. Raw creativity meets sustainable materials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button 
                className="bg-primary text-black hover:bg-primary/90 font-bold uppercase px-8 py-6 text-lg"
              >
                View Gallery
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-bold uppercase px-8 py-6 text-lg"
              >
                Shop Now
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t-2 border-foreground">
              <div>
                <div className="text-3xl font-black text-primary">100%</div>
                <p className="text-xs text-gray-400 uppercase font-bold">Recycled</p>
              </div>
              <div>
                <div className="text-3xl font-black text-secondary">HAND</div>
                <p className="text-xs text-gray-400 uppercase font-bold">Crafted</p>
              </div>
              <div>
                <div className="text-3xl font-black text-accent">UNIQUE</div>
                <p className="text-xs text-gray-400 uppercase font-bold">Pieces</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Combined Figures */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-secondary/10 opacity-30"></div>
            <img 
              src="/images/combined-figures.png" 
              alt="Combined Street Art Figures" 
              className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-primary" />
        </div>
      </section>

      {/* Art Gallery Section - Placeholder */}
      <section id="art" className="relative py-24 bg-card diagonal-cut-inverse">
        <div className="container space-y-12">
          <div>
            <h2 className="text-5xl font-black mb-4">
              ART <span className="text-primary">GALLERY</span>
            </h2>
            <p className="text-gray-400 text-lg">Explore our collection of handcrafted wooden plank artwork</p>
          </div>

          {/* Gallery Grid - Placeholder */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item}
                className="aspect-square bg-gradient-to-br from-card to-background border-2 border-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <Palette className="w-16 h-16 text-foreground/20 group-hover:text-primary/50 transition-colors mb-4" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity flex items-center justify-center">
                    <span className="text-primary font-black text-lg">View Piece</span>
                  </div>
                  <span className="text-sm text-foreground/40 group-hover:text-foreground/60 transition-colors font-bold">
                    ARTWORK #{item}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button 
              className="bg-primary text-black hover:bg-primary/90 font-bold uppercase px-8 py-4"
            >
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section - Placeholder */}
      <section id="products" className="relative py-24">
        <div className="container space-y-12">
          <div>
            <h2 className="text-5xl font-black mb-4">
              <span className="text-secondary">PRODUCTS</span> & PIECES
            </h2>
            <p className="text-gray-400 text-lg">Limited edition artwork available for purchase</p>
          </div>

          {/* Product Grid - Placeholder */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={item}
                className="border-2 border-foreground bg-card hover:bg-card/80 transition-all duration-300 overflow-hidden group"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center relative">
                  <ShoppingBag className="w-12 h-12 text-foreground/20 group-hover:text-primary/50 transition-colors" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-black text-lg uppercase">Piece {item}</h3>
                  <p className="text-sm text-gray-400">Recycled wood artwork</p>
                  <div className="flex items-center justify-between pt-2 border-t border-foreground/20">
                    <span className="font-black text-primary">€XXX</span>
                    <Button 
                      variant="outline"
                      className="text-xs border-primary text-primary hover:bg-primary hover:text-black"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops Section - Placeholder */}
      <section id="workshops" className="relative py-24 bg-card diagonal-cut">
        <div className="container space-y-12">
          <div>
            <h2 className="text-5xl font-black mb-4">
              <span className="text-accent">WORKSHOPS</span> & CLASSES
            </h2>
            <p className="text-gray-400 text-lg">Learn the craft of street art on recycled wood</p>
          </div>

          {/* Workshop Cards - Placeholder */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Beginner", duration: "2 hours", level: "Intro to street art on wood" },
              { title: "Intermediate", duration: "4 hours", level: "Technique & style development" },
              { title: "Advanced", duration: "Full day", level: "Professional-level creation" }
            ].map((workshop, idx) => (
              <div 
                key={idx}
                className="border-2 border-foreground bg-background hover:bg-background/80 transition-all duration-300 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-black uppercase">{workshop.title}</h3>
                  <Hammer className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400"><span className="font-bold">Duration:</span> {workshop.duration}</p>
                  <p className="text-sm text-gray-400">{workshop.level}</p>
                </div>
                <Button 
                  className="w-full bg-primary text-black hover:bg-primary/90 font-bold uppercase mt-4"
                >
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Feature Section */}
      <section className="relative py-24">
        <div className="container space-y-12">
          <h2 className="text-5xl font-black">
            WHY <span className="text-primary">CHOOSE</span> US
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "♻️", title: "100% Recycled", desc: "Sustainable materials" },
              { icon: "✋", title: "Hand Crafted", desc: "Artisan quality" },
              { icon: "🎨", title: "Unique Designs", desc: "One-of-a-kind pieces" },
              { icon: "🔥", title: "Raw Energy", desc: "Authentic street art" }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 border-2 border-foreground hover:border-primary hover:bg-foreground/5 transition-all duration-300 text-center space-y-3"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="font-black text-lg uppercase">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Placeholder */}
      <section id="contact" className="relative py-24 bg-card">
        <div className="container max-w-2xl">
          <h2 className="text-5xl font-black mb-8">
            GET IN <span className="text-accent">TOUCH</span>
          </h2>

          <div className="space-y-6">
            <div className="p-6 border-2 border-foreground bg-background hover:bg-background/80 transition-colors">
              <h3 className="font-black text-primary mb-2 uppercase">Email</h3>
              <p className="text-gray-300">contact@zaanseplanktjesmafia.nl</p>
            </div>

            <div className="p-6 border-2 border-foreground bg-background hover:bg-background/80 transition-colors">
              <h3 className="font-black text-secondary mb-2 uppercase">Location</h3>
              <p className="text-gray-300">Zaandam, Netherlands</p>
            </div>

            <div className="p-6 border-2 border-foreground bg-background hover:bg-background/80 transition-colors">
              <h3 className="font-black text-accent mb-3 uppercase">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-primary hover:text-secondary transition-colors font-bold uppercase text-sm">Instagram</a>
                <a href="#" className="text-primary hover:text-secondary transition-colors font-bold uppercase text-sm">Twitter</a>
                <a href="#" className="text-primary hover:text-secondary transition-colors font-bold uppercase text-sm">TikTok</a>
              </div>
            </div>

            <Button 
              className="w-full bg-primary text-black hover:bg-primary/90 font-black uppercase py-6 text-lg mt-8"
            >
              Send Message
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-12 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <img 
                src="/images/qr-code-design.png" 
                alt="Zaanse Planktjes Mafia" 
                className="h-8 w-8 object-cover"
              />
              <p className="font-bold text-sm">© 2025 ZAANSE PLANKTJES MAFIA</p>
            </div>
            <p className="text-gray-400 text-sm">Handcrafted Artwork on Recycled Wood</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
