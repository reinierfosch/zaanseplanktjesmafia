import { CollaborationSection } from "@/components/CollaborationSection";

export function PartnersTab() {
  return (
    <section 
      className="relative min-h-screen flex flex-col"
      role="tabpanel"
      id="tabpanel-partners"
      aria-labelledby="tab-partners"
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
      <div className="container relative z-10 py-20 flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full space-y-12">
          {/* Main Headline */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-black leading-tight text-white drop-shadow-lg">
              PARTNERS
            </h1>
            <div className="w-32 h-2 bg-yellow-400 mx-auto" aria-hidden="true"></div>
            <p className="text-xl md:text-2xl font-bold text-white drop-shadow-md max-w-2xl mx-auto leading-tight">
              Zaanse Plankjes Maffia werkt samen met creatieve partners
            </p>
          </div>

          {/* Collaboration Section */}
          <div className="mt-12">
            <CollaborationSection />
          </div>
        </div>
      </div>
    </section>
  );
}

