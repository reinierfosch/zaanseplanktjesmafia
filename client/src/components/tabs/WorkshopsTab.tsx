import { Button } from "@/components/ui/button";
import { workshops } from "@/data/workshops";

export function WorkshopsTab() {
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

        <div className="grid md:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <article 
              key={workshop.id}
              className="industrial-box p-8 space-y-4 hover:shadow-2xl transition-all bg-gray-900 border-4 border-white"
            >
              <h3 className="text-2xl font-black uppercase text-yellow-400">{workshop.title}</h3>
              <p className="font-mono text-sm leading-relaxed text-gray-300">
                {workshop.desc}
              </p>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-gray-400" aria-label={`Duur: ${workshop.duration}`}>
                  ⏱ {workshop.duration}
                </p>
                <ul className="text-xs space-y-1 text-gray-400" aria-label="Inbegrepen features">
                  {workshop.features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t-2 border-white">
                <p className="text-2xl font-black text-yellow-400 mb-4" aria-label={`Prijs: ${workshop.price}`}>
                  {workshop.price}
                </p>
                <Button
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-black py-3 uppercase"
                  aria-label={`Inschrijven voor ${workshop.title}`}
                >
                  Inschrijven
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

