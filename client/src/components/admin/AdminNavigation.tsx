import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AdminTab = "dashboard" | "artworks" | "orders" | "newsletter" | "contact";

interface AdminNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export function AdminNavigation({ activeTab, onTabChange }: AdminNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as AdminTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        <TabsTrigger value="dashboard" className="font-black uppercase text-xs md:text-sm">
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="artworks" className="font-black uppercase text-xs md:text-sm">
          Kunstwerken
        </TabsTrigger>
        <TabsTrigger value="orders" className="font-black uppercase text-xs md:text-sm">
          Bestellingen
        </TabsTrigger>
        <TabsTrigger value="newsletter" className="font-black uppercase text-xs md:text-sm">
          Nieuwsbrief
        </TabsTrigger>
        <TabsTrigger value="contact" className="font-black uppercase text-xs md:text-sm">
          Contact
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

