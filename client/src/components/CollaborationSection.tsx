/**
 * Collaboration section showing partnerships
 */
export function CollaborationSection() {
  return (
    <div className="relative z-30 py-12 px-4 border-t-4 border-yellow-400 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Title */}
          <p className="text-white text-xs font-bold uppercase tracking-widest opacity-80">
            In samenwerking met
          </p>

          {/* Partners */}
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            {/* Reinier Fosch / Reintje aan de Praat */}
            <a
              href="https://reintjeaandepraat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 hover:opacity-90 transition-all hover:scale-105 min-w-[200px]"
            >
              <div className="bg-white/5 p-4 rounded-lg transition-colors">
                <img
                  src="/images/logo-reinier-fosch.webp"
                  alt="Reinier Fosch - Reintje aan de Praat"
                  className="h-16 md:h-20 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-white font-black text-xs md:text-sm uppercase tracking-wider text-center max-w-[200px]">
                REINTJEAANDEPRAAT.COM
              </span>
            </a>

            {/* Separator */}
            <div className="h-20 w-0.5 bg-yellow-400/30 hidden md:block" aria-hidden="true" />

            {/* Zaanstadsdichter */}
            <a
              href="https://zaanstadsdichter.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 hover:opacity-90 transition-all hover:scale-105 min-w-[200px]"
            >
              <div className="bg-white/5 p-4 rounded-lg transition-colors">
                <img
                  src="/images/logo-zaanstadsdichter.jpg"
                  alt="Zaanstadsdichter"
                  className="h-16 md:h-20 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-white font-black text-xs md:text-sm uppercase tracking-wider text-center max-w-[200px]">
                ZAANSTADSDICHTER.NL
              </span>
            </a>

            {/* Separator */}
            <div className="h-20 w-0.5 bg-yellow-400/30 hidden md:block" aria-hidden="true" />

            {/* Roshism - Using their actual logo, cropped to show text larger */}
            <a
              href="https://roshism.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 hover:opacity-90 transition-all hover:scale-105 min-w-[200px]"
            >
              <div className="bg-white/5 p-4 rounded-lg transition-colors flex items-center justify-center overflow-hidden h-28 md:h-36 w-56 md:w-72">
                <img
                  src="/images/roshism-logo.png"
                  alt="ROSHISM"
                  className="h-full w-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity"
                  style={{
                    objectPosition: 'center 30%',
                  }}
                />
              </div>
              <span className="text-white/70 font-bold text-xs uppercase tracking-widest text-center max-w-[200px]">
                ROSHISM.COM
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

