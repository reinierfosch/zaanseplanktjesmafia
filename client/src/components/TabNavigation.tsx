import { TabId } from "@/types";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  showHomeIcon?: boolean;
}

export function TabNavigation({ activeTab, onTabChange, showHomeIcon = false }: TabNavigationProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "home", label: "HOME" },
    { id: "gallery", label: "KUNSTGALERIE" },
    { id: "workshops", label: "WORKSHOPS" },
    { id: "contact", label: "CONTACT" },
    { id: "partners", label: "PARTNERS" }
  ];

  return (
    <div 
      className="bg-black border-b-4 border-foreground flex overflow-x-auto items-center"
      role="tablist"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex-shrink-0 px-4 py-2 border-r-4 border-foreground">
        <img
          src="/images/logo-plankjesmaffia.svg"
          alt="De Zaanse Plankjes Maffia"
          className="logo-plankjesmaffia"
        />
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={`px-8 py-4 font-black text-lg uppercase whitespace-nowrap border-r-4 border-foreground transition-all focus:outline-none focus:ring-4 focus:ring-primary flex items-center gap-2 ${
            activeTab === tab.id
              ? "bg-primary text-white"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {tab.id === "home" && showHomeIcon && (
            <img
              src="/images/silhouette.png"
              alt=""
              className="w-6 h-6 object-contain"
              aria-hidden="true"
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

