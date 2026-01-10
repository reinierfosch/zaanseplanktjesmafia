import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Package, Mail, MessageSquare } from "lucide-react";

interface DashboardStats {
  artworks: {
    total: number;
    available: number;
  };
  orders: {
    total: number;
    recent: number;
  };
  newsletter: {
    total: number;
    active: number;
  };
  contact: {
    total: number;
    unread: number;
  };
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const sessionId = localStorage.getItem("adminSessionId");
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="industrial-box p-8">
        <p className="font-mono text-center py-12">Dashboard laden...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="industrial-box p-8">
        <p className="font-mono text-center py-12 text-red-600">Fout bij laden van dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="industrial-box">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase">Kunstwerken</CardTitle>
            <Image className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.artworks.total}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.artworks.available} beschikbaar
            </p>
          </CardContent>
        </Card>

        <Card className="industrial-box">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase">Bestellingen</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.orders.total}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.orders.recent} deze week
            </p>
          </CardContent>
        </Card>

        <Card className="industrial-box">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase">Nieuwsbrief</CardTitle>
            <Mail className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.newsletter.total}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.newsletter.active} actief
            </p>
          </CardContent>
        </Card>

        <Card className="industrial-box">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase">Contact</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.contact.total}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.contact.unread} ongelezen
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

