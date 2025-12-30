import { TabId } from "@/types";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "home", label: "HOME" },
    { id: "gallery", label: "KUNSTGALERIE" },
    { id: "workshops", label: "WORKSHOPS" },
    { id: "contact", label: "CONTACT" },
    { id: "partners", label: "PARTNERS" }
  ];

  return (
    <div 
      className="bg-black border-b-4 border-foreground flex overflow-x-auto"
      role="tablist"
      aria-label="Main navigation"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={`px-8 py-4 font-black text-lg uppercase whitespace-nowrap border-r-4 border-foreground transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400 ${
            activeTab === tab.id
              ? "bg-yellow-400 text-black"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

