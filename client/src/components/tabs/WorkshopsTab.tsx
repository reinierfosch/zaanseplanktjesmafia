import { useState, useEffect } from "react";

/**
 * Grappige "onder constructie" zinnetjes met maffia- en plankjes-thema's
 */
const constructionMessages = [
  "Deze workshop wordt nog 'in elkaar getimmerd'...",
  "We zijn nog bezig met het 'planken' van deze workshop.",
  "Deze workshop zit nog 'in de houtbewerking'.",
  "We 'schaven' nog aan deze workshop...",
  "Deze workshop wordt nog 'gezaagd en geschuurd'.",
  "We zijn nog bezig met het 'polijsten' van deze workshop.",
  "Deze workshop zit nog 'in de zaagbank'.",
  "We 'lijmen' nog de laatste details aan elkaar...",
  "Deze workshop wordt nog 'geverfd en afgewerkt'.",
  "We zijn nog bezig met het 'fine-tunen' van deze workshop.",
  "Deze workshop zit nog 'in de werkplaats'.",
  "We 'boren' nog de laatste gaten...",
  "Deze workshop wordt nog 'geassembleerd'.",
  "We zijn nog bezig met het 'testen' van deze workshop.",
  "Deze workshop zit nog 'in de maak'.",
  "We 'hameren' nog de laatste details erin...",
  "Deze workshop wordt nog 'geperfectioneerd'.",
  "We zijn nog bezig met het 'afwerken' van deze workshop.",
  "Deze workshop zit nog 'in de productie'.",
  "We 'slaan' nog de laatste spijkers erin...",
];

export function WorkshopsTab() {
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    // Kies een random bericht
    const randomMessage = constructionMessages[Math.floor(Math.random() * constructionMessages.length)];
    setCurrentMessage(randomMessage);

    // Verander het bericht elke 5 seconden
    const interval = setInterval(() => {
      const newMessage = constructionMessages[Math.floor(Math.random() * constructionMessages.length)];
      setCurrentMessage(newMessage);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative min-h-screen py-24 bg-black text-white"
      role="tabpanel"
      id="tabpanel-workshops"
      aria-labelledby="tab-workshops"
    >
      <div className="container space-y-12">
        <div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            WORKSHOPS
          </h2>
          <p className="text-lg font-mono text-gray-300">
            Leer zelf kunstwerken maken op houten planken. Alle materialen inbegrepen.
          </p>
        </div>

        {/* Onder Constructie Sectie */}
        <div className="space-y-8">
          <div className="industrial-box p-12 bg-gray-900 border-4 border-yellow-400 text-center">
            <div className="mb-6">
              <h3 className="text-4xl md:text-5xl font-black uppercase text-yellow-400 mb-4">
                🚧 ONDER CONSTRUCTIE 🚧
              </h3>
              <p className="text-xl md:text-2xl font-mono text-white animate-pulse">
                {currentMessage}
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t-4 border-white">
              <p className="text-sm font-mono text-gray-400 italic">
                "We werken er hard aan om deze workshops 'in de steigers' te zetten!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

