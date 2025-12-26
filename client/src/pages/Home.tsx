import { Button } from "@/components/ui/button";
import { Mail, ShoppingCart } from "lucide-react";
import { useState } from "react";

/**
 * De Zaanse Plankjes Maffia - Art on Wooden Planks
 * Focus: Selling unique artwork on wooden planks
 * Design: Industrial/craft aesthetic with art gallery showcase
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

  // Gallery artworks
  const artworks = [
    {
      title: "Portret met Glitter",
      image: "WhatsAppImage2025-12-26at18.45.30.jpeg",
      price: "€145"
    },
    {
      title: "Familie Moment",
      image: "WhatsAppImage2025-12-26at18.45.30(1).jpeg",
      price: "€155"
    },
    {
      title: "Sketch & Color",
      image: "WhatsAppImage2025-12-26at18.45.30(2).jpeg",
      price: "€150"
    },
    {
      title: "Portret Collectie",
      image: "WhatsAppImage2025-12-26at18.45.30(3).jpeg",
      price: "€165"
    },
    {
      title: "Kunstwerk met Details",
      image: "WhatsAppImage2025-12-26at18.45.30(4).jpeg",
      price: "€160"
    },
    {
      title: "Glitter Accenten",
      image: "WhatsAppImage2025-12-26at18.45.31.jpeg",
      price: "€155"
    },
    {
      title: "Portret Duet",
      image: "WhatsAppImage2025-12-26at18.45.31(1).jpeg",
      price: "€150"
    },
    {
      title: "Familie Kunstwerk",
      image: "WhatsAppImage2025-12-26at18.45.31(2).jpeg",
      price: "€160"
    },
    {
      title: "Engel Portret",
      image: "WhatsAppImage2025-12-26at18.45.31(3).jpeg",
      price: "€155"
    },
    {
      title: "Superhero Art",
      image: "WhatsAppImage2025-12-26at18.45.31(4).jpeg",
      price: "€165"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Moving Marquee Tape - URL Pattern */}
      <div className="marquee-tape sticky top-0 z-50 border-y-4 border-foreground">
        <div className="marquee-tape-content">
          ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL •
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
            <div className="w-24 h-2 bg-yellow-400"></div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-black text-lg px-8 py-6 uppercase flex items-center gap-2"
              >
                <ShoppingCart size={24} />
                SHOP KUNSTWERKEN
              </Button>
              <Button
                variant="outline"
                className="border-4 border-white text-white hover:bg-white/10 font-black text-lg px-8 py-6 uppercase"
              >
                MEER INFORMATIE
              </Button>
            </div>
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
      <div className="marquee-tape border-y-4 border-foreground bg-orange-500 text-white">
        <div className="marquee-tape-content">
          ★ HANDGEMAAKT ★ ORIGINEEL ★ UNIEK ★ HANDGEMAAKT ★ ORIGINEEL ★ UNIEK ★ HANDGEMAAKT ★
        </div>
      </div>

      {/* Gallery Section */}
      <section className="relative py-24 bg-white">
        <div className="container space-y-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              KUNSTGALERIE
            </h2>
            <p className="text-lg font-mono text-gray-700">
              Ontdek onze collectie van handgemaakte kunstwerken op houten planken.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork, idx) => (
              <div 
                key={idx}
                className="industrial-box overflow-hidden hover:shadow-2xl transition-all group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img 
                    src={`/images/${artwork.image}`}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-black uppercase">{artwork.title}</h3>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                    <p className="text-2xl font-black text-orange-600">{artwork.price}</p>
                    <Button
                      className="bg-black text-white hover:bg-gray-800 font-black px-4 py-2 uppercase text-sm"
                    >
                      Koop
                    </Button>
                  </div>
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

      {/* Why Choose Us */}
      <section className="relative py-24 bg-black text-white">
        <div className="container space-y-12">
          <h2 className="text-5xl md:text-6xl font-black">
            WAAROM PLANKJES MAFFIA?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((feature, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-2xl font-black uppercase text-yellow-400">
                  {feature.title}
                </h3>
                <p className="font-mono text-lg text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moving Tape Divider */}
      <div className="marquee-tape border-y-4 border-foreground bg-orange-500 text-white">
        <div className="marquee-tape-content">
          ⚡ WORKSHOPS BESCHIKBAAR ⚡ WORKSHOPS BESCHIKBAAR ⚡ WORKSHOPS BESCHIKBAAR ⚡
        </div>
      </div>

      {/* Workshops Section */}
      <section className="relative py-24 bg-white">
        <div className="container space-y-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              WORKSHOPS
            </h2>
            <p className="text-lg font-mono text-gray-700">
              Leer zelf kunstwerken maken op houten planken.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Beginner Workshop",
                desc: "Leer de basis van portrettekenen op hout.",
                price: "€135 p.p.",
                duration: "2 uur"
              },
              {
                title: "Intermediate Workshop",
                desc: "Voeg glitter en kleur toe aan je kunstwerken.",
                price: "€145 p.p.",
                duration: "3 uur"
              },
              {
                title: "Advanced Workshop",
                desc: "Creëer je eigen meesterwerk met alle technieken.",
                price: "€155 p.p.",
                duration: "4 uur"
              }
            ].map((workshop, idx) => (
              <div 
                key={idx}
                className="industrial-box p-8 space-y-4 hover:shadow-2xl transition-all"
              >
                <h3 className="text-2xl font-black uppercase">{workshop.title}</h3>
                <p className="font-mono text-sm leading-relaxed text-gray-700">
                  {workshop.desc}
                </p>
                <div className="space-y-2 pt-4 border-t-2 border-black">
                  <p className="text-xs font-bold uppercase text-gray-600">
                    ⏱ {workshop.duration}
                  </p>
                  <p className="text-2xl font-black text-orange-600">
                    {workshop.price}
                  </p>
                </div>
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800 font-black py-3 uppercase"
                >
                  Inschrijven
                </Button>
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
                STAY IN THE LOOP
              </h2>
              <p className="text-lg font-mono text-gray-700">
                Ontvang updates over nieuwe kunstwerken, workshops en exclusieve aanbiedingen.
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
                  ABONNEER
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
                <a href="#" className="font-mono font-bold hover:text-orange-600 transition-colors">TikTok</a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t-4 border-black pt-8 text-center">
            <p className="font-mono text-sm text-gray-600">
              © 2025 De Zaanse Plankjes Maffia • Kunstwerken op Houten Planken
            </p>
            <p className="font-mono text-xs text-gray-500 mt-2">
              Handgemaakt in Zaandam • Origineel Design • Unieke Kunstwerken
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
