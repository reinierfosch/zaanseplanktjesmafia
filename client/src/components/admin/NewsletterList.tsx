import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsletterSubscription {
  id: number;
  email: string;
  name?: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  status: "active" | "unsubscribed";
}

export function NewsletterList() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const sessionId = localStorage.getItem("adminSessionId");
      const response = await fetch("/api/admin/newsletter", {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch newsletter subscriptions");
      }

      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching newsletter subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const activeEmails = subscriptions
      .filter((s) => s.status === "active")
      .map((s) => s.email)
      .join("\n");
    
    const blob = new Blob([activeEmails], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscriptions-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="industrial-box p-8">
        <p className="font-mono text-center py-12">Nieuwsbrief abonnees laden...</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="industrial-box p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black uppercase">Nieuwsbrief Abonnees</h2>
        <Button
          onClick={handleExport}
          className="bg-black text-white hover:bg-gray-800 font-black"
        >
          Exporteer Actieve Abonnees
        </Button>
      </div>
      {subscriptions.length === 0 ? (
        <p className="font-mono text-center py-12">Geen abonnees gevonden</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-black uppercase">Email</TableHead>
                <TableHead className="font-black uppercase">Naam</TableHead>
                <TableHead className="font-black uppercase">Status</TableHead>
                <TableHead className="font-black uppercase">Inschrijfdatum</TableHead>
                <TableHead className="font-black uppercase">Uitschrijfdatum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>{subscription.email}</TableCell>
                  <TableCell>{subscription.name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                      {subscription.status === "active" ? "Actief" : "Uitgeschreven"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(subscription.subscribed_at)}</TableCell>
                  <TableCell className="text-sm">
                    {subscription.unsubscribed_at ? formatDate(subscription.unsubscribed_at) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

