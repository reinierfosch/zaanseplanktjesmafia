import { Button } from "@/components/ui/button";
import { Mail, ShoppingCart } from "lucide-react";
import { useState } from "react";

/**
 * De Zaanse Plankjes Maffia - Art on Wooden Planks
 * Tab-based navigation without scrolling
 * Design: Industrial/craft aesthetic with art gallery showcase
 */

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
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
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Moving Marquee Tape - URL Pattern */}
      <div className="marquee-tape z-50 border-y-4 border-foreground">
        <div className="marquee-tape-content">
          ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL •
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-black border-b-4 border-foreground flex overflow-x-auto">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-8 py-4 font-black text-lg uppercase whitespace-nowrap border-r-4 border-foreground transition-all ${
            activeTab === "home"
              ? "bg-yellow-400 text-black"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          HOME
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-8 py-4 font-black text-lg uppercase whitespace-nowrap border-r-4 border-foreground transition-all ${
            activeTab === "gallery"
              ? "bg-yellow-400 text-black"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          KUNSTGALERIE
        </button>
        <button
          onClick={() => setActiveTab("workshops")}
          className={`px-8 py-4 font-black text-lg uppercase whitespace-nowrap border-r-4 border-foreground transition-all ${
            activeTab === "workshops"
              ? "bg-yellow-400 text-black"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          WORKSHOPS
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-8 py-4 font-black text-lg uppercase whitespace-nowrap transition-all ${
            activeTab === "contact"
              ? "bg-yellow-400 text-black"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          CONTACT
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* HOME TAB */}
        {activeTab === "home" && (
          <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(/images/workshop-hero-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
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
                    onClick={() => setActiveTab("gallery")}
                    className="bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-black text-lg px-8 py-6 uppercase flex items-center gap-2"
                  >
                    <ShoppingCart size={24} />
                    SHOP KUNSTWERKEN
                  </Button>
                  <Button
                    onClick={() => setActiveTab("contact")}
                    variant="outline"
                    className="border-4 border-white text-white hover:bg-white/10 font-black text-lg px-8 py-6 uppercase"
                  >
                    MEER INFORMATIE
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <section className="relative min-h-screen py-24 bg-white">
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

              {/* Why Choose Us */}
              <div className="border-t-4 border-black pt-12 mt-12">
                <h3 className="text-4xl font-black mb-8">WAAROM PLANKJES MAFFIA?</h3>
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
        )}

        {/* WORKSHOPS TAB */}
        {activeTab === "workshops" && (
          <section className="relative min-h-screen py-24 bg-black text-white">
            <div className="container space-y-12">
              <div>
                <h2 className="text-5xl md:text-6xl font-black mb-4">
                  WORKSHOPS
                </h2>
                <p className="text-lg font-mono text-gray-300">
                  Leer zelf kunstwerken maken op houten planken. Alle materialen inbegrepen.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Beginner Workshop",
                    desc: "Leer de basis van portrettekenen op hout. Perfect voor beginners!",
                    price: "€35 p.p.",
                    duration: "2 uur",
                    features: ["Alle materialen", "Persoonlijke begeleiding", "Kunstwerk mee naar huis"]
                  },
                  {
                    title: "Intermediate Workshop",
                    desc: "Voeg glitter en kleur toe aan je kunstwerken. Maak het extra speciaal.",
                    price: "€45 p.p.",
                    duration: "3 uur",
                    features: ["Geavanceerde technieken", "Glitter & kleuren", "Professioneel advies"]
                  },
                  {
                    title: "Advanced Workshop",
                    desc: "Creëer je eigen meesterwerk met alle technieken. Voor gevorderden.",
                    price: "€55 p.p.",
                    duration: "4 uur",
                    features: ["Alle technieken", "Custom design", "Portfolio-kwaliteit"]
                  }
                ].map((workshop, idx) => (
                  <div 
                    key={idx}
                    className="industrial-box p-8 space-y-4 hover:shadow-2xl transition-all bg-gray-900 border-4 border-white"
                  >
                    <h3 className="text-2xl font-black uppercase text-yellow-400">{workshop.title}</h3>
                    <p className="font-mono text-sm leading-relaxed text-gray-300">
                      {workshop.desc}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-gray-400">
                        ⏱ {workshop.duration}
                      </p>
                      <ul className="text-xs space-y-1 text-gray-400">
                        {workshop.features.map((feature, i) => (
                          <li key={i}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t-2 border-white">
                      <p className="text-2xl font-black text-yellow-400 mb-4">
                        {workshop.price}
                      </p>
                      <Button
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-black py-3 uppercase"
                      >
                        Inschrijven
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT TAB */}
        {activeTab === "contact" && (
          <section className="relative min-h-screen py-24 bg-white">
            <div className="container space-y-12">
              <div>
                <h2 className="text-5xl md:text-6xl font-black mb-4">
                  CONTACT & NIEUWSBRIEF
                </h2>
                <p className="text-lg font-mono text-gray-700">
                  Neem contact op of meld je aan voor updates.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="industrial-box p-8 space-y-4">
                    <h3 className="text-2xl font-black uppercase">CONTACTGEGEVENS</h3>
                    
                    <div className="space-y-6 pt-4 border-t-4 border-black">
                      <div>
                        <p className="font-black text-sm uppercase text-gray-600 mb-2">Email</p>
                        <p className="font-mono text-xl">
                          <a href="mailto:info@plankjesmaffia.nl" className="hover:text-orange-600 transition-colors">
                            info@plankjesmaffia.nl
                          </a>
                        </p>
                      </div>

                      <div>
                        <p className="font-black text-sm uppercase text-gray-600 mb-2">Telefoon</p>
                        <p className="font-mono text-xl">
                          <a href="tel:+31612345678" className="hover:text-orange-600 transition-colors">
                            +31 (0)6 12 34 56 78
                          </a>
                        </p>
                      </div>

                      <div>
                        <p className="font-black text-sm uppercase text-gray-600 mb-2">Locatie</p>
                        <p className="font-mono text-lg">
                          Zaandam, Nederland
                        </p>
                      </div>

                      <div>
                        <p className="font-black text-sm uppercase text-gray-600 mb-2">Volg Ons</p>
                        <div className="flex gap-4">
                          <a href="#" className="font-mono font-bold hover:text-orange-600 transition-colors">Instagram</a>
                          <a href="#" className="font-mono font-bold hover:text-orange-600 transition-colors">TikTok</a>
                          <a href="#" className="font-mono font-bold hover:text-orange-600 transition-colors">Facebook</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="industrial-box p-8 space-y-6">
                  <h3 className="text-2xl font-black uppercase">ABONNEER OP NIEUWSBRIEF</h3>
                  
                  <p className="font-mono text-lg text-gray-700">
                    Ontvang updates over nieuwe kunstwerken, workshops en exclusieve aanbiedingen.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-black text-sm uppercase text-gray-600">Naam</label>
                      <input
                        type="text"
                        placeholder="Jouw naam"
                        className="w-full px-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-orange-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-black text-sm uppercase text-gray-600">Email</label>
                      <input
                        type="email"
                        placeholder="je@email.nl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-lg px-8 py-4 uppercase mt-6"
                    >
                      ABONNEER
                    </Button>

                    {submitted && (
                      <p className="text-green-600 font-bold text-center">✓ Je bent ingeschreven!</p>
                    )}
                  </form>

                  <div className="border-t-4 border-black pt-6 text-center">
                    <p className="font-mono text-xs text-gray-600">
                      We respecteren je privacy. Geen spam, alleen updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
