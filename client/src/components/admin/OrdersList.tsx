import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface Order {
  id: string;
  artworkId?: string;
  orderType: string;
  options?: {
    thinnerWood?: boolean;
    differentFinish?: boolean;
    fewerColors?: boolean;
  };
  inspiration?: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
  createdAt: string;
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const sessionId = localStorage.getItem("adminSessionId");
      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="industrial-box p-8">
        <p className="font-mono text-center py-12">Bestellingen laden...</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="industrial-box p-8">
      <h2 className="text-3xl font-black uppercase mb-6">Bestellingen</h2>
      {orders.length === 0 ? (
        <p className="font-mono text-center py-12">Geen bestellingen gevonden</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-black uppercase">ID</TableHead>
                <TableHead className="font-black uppercase">Type</TableHead>
                <TableHead className="font-black uppercase">Naam</TableHead>
                <TableHead className="font-black uppercase">Email</TableHead>
                <TableHead className="font-black uppercase">Datum</TableHead>
                <TableHead className="font-black uppercase">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell className="uppercase">{order.orderType}</TableCell>
                  <TableCell>{order.contactInfo.name}</TableCell>
                  <TableCell>{order.contactInfo.email}</TableCell>
                  <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="font-black"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black uppercase">
                            Bestelling Details
                          </DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div>
                              <p className="font-black uppercase text-sm mb-1">Order ID</p>
                              <p className="font-mono text-sm">{selectedOrder.id}</p>
                            </div>
                            <div>
                              <p className="font-black uppercase text-sm mb-1">Type</p>
                              <p className="uppercase">{selectedOrder.orderType}</p>
                            </div>
                            {selectedOrder.artworkId && (
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Kunstwerk ID</p>
                                <p className="font-mono text-sm">{selectedOrder.artworkId}</p>
                              </div>
                            )}
                            {selectedOrder.options && Object.keys(selectedOrder.options).length > 0 && (
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Opties</p>
                                <ul className="list-disc list-inside">
                                  {selectedOrder.options.thinnerWood && <li>Dunner hout</li>}
                                  {selectedOrder.options.differentFinish && <li>Andere afwerking</li>}
                                  {selectedOrder.options.fewerColors && <li>Minder kleuren</li>}
                                </ul>
                              </div>
                            )}
                            {selectedOrder.inspiration && (
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Inspiratie</p>
                                <p>{selectedOrder.inspiration}</p>
                              </div>
                            )}
                            <div>
                              <p className="font-black uppercase text-sm mb-1">Contactgegevens</p>
                              <p>Naam: {selectedOrder.contactInfo.name}</p>
                              <p>Email: <a href={`mailto:${selectedOrder.contactInfo.email}`} className="text-blue-600 underline">{selectedOrder.contactInfo.email}</a></p>
                              {selectedOrder.contactInfo.phone && <p>Telefoon: {selectedOrder.contactInfo.phone}</p>}
                              {selectedOrder.contactInfo.message && (
                                <div className="mt-2">
                                  <p className="font-black uppercase text-sm mb-1">Bericht</p>
                                  <p className="whitespace-pre-wrap">{selectedOrder.contactInfo.message}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black uppercase text-sm mb-1">Datum</p>
                              <p>{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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

