import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";

/**
 * De Zaanse Plankjes Maffia - Coming Soon Landing Page
 * Industrial / Craft / Urban Aesthetic
 * Design: Raw workshop vibe, heavy typography, moving tape marquee with URL pattern
 */

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Moving Marquee Tape - URL Pattern */}
      <div className="marquee-tape sticky top-0 z-50 border-y-4 border-foreground">
        <div className="marquee-tape-content">
          ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL •
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/workshop-hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Mascotte Stamp - Background */}
        <div className="absolute top-10 right-10 z-5 w-48 h-48 opacity-10">
          <img 
            src="/images/qr-code-design.png" 
            alt="" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl space-y-8">
            {/* Main Headline */}
            <h1 className="text-7xl md:text-8xl font-black leading-tight text-white drop-shadow-lg">
              HIER WORDT
              <br />
              <span className="text-yellow-400">GEZAAGD</span>
            </h1>

            {/* Subheadline */}
            <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-md max-w-2xl leading-tight">
              De Zaanse Plankjes Maffia neemt de boel over.
              <br />
              Wij upcyclen afvalhout tot crimineel goede planken.
            </p>

            {/* Decorative Line */}
            <div className="w-24 h-2 bg-yellow-400"></div>

            {/* CTA Text */}
            <p className="text-lg md:text-xl text-gray-200 font-mono">
              Coming Soon • Wij zijn aan het bouwen
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-center">
            <div className="text-sm font-bold mb-2">SCROLL</div>
            <div className="text-2xl">↓</div>
          </div>
        </div>
      </section>

      {/* Moving Tape Divider */}
      <div className="marquee-tape border-y-4 border-foreground">
        <div className="marquee-tape-content">
          • UPCYCLED • HANDMADE • SUSTAINABLE • UPCYCLED • HANDMADE • SUSTAINABLE • UPCYCLED • HANDMADE • SUSTAINABLE •
        </div>
      </div>

      {/* Mission Section - De Missie */}
      <section className="relative py-24 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-black">
                DE MISSIE
              </h2>

              <div className="space-y-4 font-mono text-lg leading-relaxed">
                <p>
                  Afvalhout verdwijnt. Dat kan niet. Dat mag niet.
                </p>
                <p>
                  Wij geven afvalhout een tweede leven. Elke plank vertelt een verhaal van 
                  duurzaamheid, ambacht en rebellie tegen verspilling.
                </p>
                <p>
                  Onze planken zijn niet zomaar hout. Het zijn kunstwerken. Het zijn statements.
                  Het zijn de toekomst van upcycling.
                </p>
              </div>

              <div className="pt-4 border-t-4 border-black">
                <p className="font-bold text-sm uppercase">
                  100% Gerecycled • 100% Handgemaakt • 100% Crimineel Goed
                </p>
              </div>
            </div>

            {/* Right: Visual - Mascotte Silhouette */}
            <div className="relative h-96 flex items-center justify-center">
              <div className="relative w-full h-full">
                <img 
                  src="/images/street-art-figure.png" 
                  alt="Mascotte met plank" 
                  className="w-full h-full object-contain opacity-80"
                />
                {/* Chalk line effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, white 0px, white 10px, transparent 10px, transparent 20px)'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Tape Divider */}
      <div className="marquee-tape border-y-4 border-foreground bg-orange-500 text-white">
        <div className="marquee-tape-content">
          ⚠ PLACE DELICT ⚠ PLACE DELICT ⚠ PLACE DELICT ⚠ PLACE DELICT ⚠ PLACE DELICT ⚠
        </div>
      </div>

      {/* Product Teaser - Het Wetboek */}
      <section className="relative py-24 bg-black text-white">
        <div className="container space-y-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              HET WETBOEK
            </h2>
            <p className="text-lg font-mono text-gray-300">
              Onze eerste collectie. Drie misdaden tegen verspilling.
            </p>
          </div>

          {/* Product Cards - Placeholder */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "De Heling",
                desc: "Gestolen van de vuilnisbelt. Gered van vernietiging.",
                icon: "🪵"
              },
              {
                title: "Samenscholing",
                desc: "Planken die samen sterker zijn. Collectief upcyclen.",
                icon: "🔗"
              },
              {
                title: "Openbare Dronkenschap",
                desc: "Ruw, ongepolijst, vol karakter. Echt ambacht.",
                icon: "🍺"
              }
            ].map((product, idx) => (
              <div 
                key={idx}
                className="industrial-box p-8 space-y-4 hover:shadow-2xl transition-all"
              >
                <div className="text-5xl mb-4">{product.icon}</div>
                <h3 className="text-2xl font-black uppercase">{product.title}</h3>
                <p className="font-mono text-sm leading-relaxed text-gray-700">
                  {product.desc}
                </p>
                <div className="pt-4 border-t-2 border-black">
                  <p className="text-xs font-bold uppercase text-orange-600">
                    Coming Soon
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moving Tape Divider */}
      <div className="marquee-tape border-y-4 border-foreground">
        <div className="marquee-tape-content">
          ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL •
        </div>
      </div>

      {/* Footer & CTA */}
      <footer className="relative py-24 bg-white border-t-4 border-black">
        <div className="container space-y-12">
          {/* Newsletter CTA */}
          <div className="max-w-2xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                WORD BOARD MEMBER
              </h2>
              <p className="text-lg font-mono text-gray-700">
                Meld je aan voor onze nieuwsbrief. Wees de eerste die hoort wanneer we lanceren.
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="je@email.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-orange-500"
                  required
                />
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-lg px-8 py-4 uppercase"
                >
                  JOIN THE FAMILY
                </Button>
              </div>
              {submitted && (
                <p className="text-green-600 font-bold">✓ Je bent ingeschreven!</p>
              )}
            </form>
          </div>

          {/* Divider */}
          <div className="border-t-4 border-black"></div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-black text-sm uppercase">Email</h3>
              <p className="font-mono text-lg">
                <a href="mailto:info@plankjesmaffia.nl" className="hover:text-orange-600 transition-colors">
                  info@plankjesmaffia.nl
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-sm uppercase">Locatie</h3>
              <p className="font-mono text-lg">
                Zaandam, Nederland
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-sm uppercase">Volg Ons</h3>
              <div className="flex gap-4">
                <a href="#" className="font-mono font-bold hover:text-orange-600 transition-colors">Instagram</a>
                <a href="#" className="font-mono font-bold hover:text-orange-600 transition-colors">Twitter</a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t-4 border-black pt-8 text-center">
            <p className="font-mono text-sm text-gray-600">
              © 2025 De Zaanse Plankjes Maffia • Handgemaakt in Zaandam
            </p>
            <p className="font-mono text-xs text-gray-500 mt-2">
              Upcycled • Sustainable • Criminal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
