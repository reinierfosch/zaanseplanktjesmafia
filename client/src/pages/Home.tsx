import { useState } from "react";
import { TabId } from "@/types";
import { TabNavigation } from "@/components/TabNavigation";
import { HomeTab } from "@/components/tabs/HomeTab";
import { GalleryTab } from "@/components/tabs/GalleryTab";
import { WorkshopsTab } from "@/components/tabs/WorkshopsTab";
import { ContactTab } from "@/components/tabs/ContactTab";
import { PartnersTab } from "@/components/tabs/PartnersTab";
import { CollaborationSection } from "@/components/CollaborationSection";

/**
 * De Zaanse Plankjes Maffia - Art on Wooden Planks
 * Tab-based navigation without scrolling
 * Design: Industrial/craft aesthetic with art gallery showcase
 */

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showHomeIcon, setShowHomeIcon] = useState(false);

  const handleNewsletterSubmit = async (email: string, name?: string) => {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to subscribe to newsletter");
    }

    const data = await response.json();
    return data;
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Moving Marquee Tape - URL Pattern */}
      <div className="marquee-tape z-50 border-y-4 border-foreground" aria-hidden="true">
        <div className="marquee-tape-content">
          ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL • ZAANSE-PLANKJESMAFFIA.NL •
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        showHomeIcon={showHomeIcon}
      />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "home" && (
          <HomeTab 
            onNavigate={setActiveTab}
            onZoomComplete={() => setShowHomeIcon(true)}
          />
        )}
        {activeTab === "gallery" && <GalleryTab />}
        {activeTab === "workshops" && <WorkshopsTab />}
        {activeTab === "contact" && <ContactTab onSubmitNewsletter={handleNewsletterSubmit} />}
        {activeTab === "partners" && <PartnersTab />}
      </div>

      {/* Footer with Collaboration Section */}
      <footer className="relative z-50">
        <CollaborationSection />
      </footer>
    </div>
  );
}
