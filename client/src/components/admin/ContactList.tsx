import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Mail, Check } from "lucide-react";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: "new" | "read" | "replied" | "archived";
  read_at?: string | null;
  created_at: string;
}

export function ContactList() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const sessionId = localStorage.getItem("adminSessionId");
      const response = await fetch("/api/admin/contact", {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contact submissions");
      }

      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const sessionId = localStorage.getItem("adminSessionId");
      const response = await fetch(`/api/admin/contact/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark as read");
      }

      await fetchSubmissions();
    } catch (error) {
      console.error("Error marking submission as read:", error);
    }
  };

  const updateStatus = async (id: number, status: "new" | "read" | "replied" | "archived") => {
    try {
      const sessionId = localStorage.getItem("adminSessionId");
      const response = await fetch(`/api/admin/contact/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionId}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchSubmissions();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="industrial-box p-8">
        <p className="font-mono text-center py-12">Contact inzendingen laden...</p>
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

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Nieuw</Badge>;
      case "read":
        return <Badge variant="secondary">Gelezen</Badge>;
      case "replied":
        return <Badge variant="outline">Beantwoord</Badge>;
      case "archived":
        return <Badge variant="outline">Gearchiveerd</Badge>;
      default:
        return <Badge variant="default">Nieuw</Badge>;
    }
  };

  return (
    <div className="industrial-box p-8">
      <h2 className="text-3xl font-black uppercase mb-6">Contact Inzendingen</h2>
      {submissions.length === 0 ? (
        <p className="font-mono text-center py-12">Geen inzendingen gevonden</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-black uppercase">Naam</TableHead>
                <TableHead className="font-black uppercase">Email</TableHead>
                <TableHead className="font-black uppercase">Onderwerp</TableHead>
                <TableHead className="font-black uppercase">Status</TableHead>
                <TableHead className="font-black uppercase">Datum</TableHead>
                <TableHead className="font-black uppercase">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.subject || "-"}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="text-sm">{formatDate(submission.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              if (submission.status === "new" || !submission.status) {
                                markAsRead(submission.id);
                              }
                            }}
                            className="font-black"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Bekijk
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase">
                              Contact Inzending
                            </DialogTitle>
                          </DialogHeader>
                          {selectedSubmission && (
                            <div className="space-y-4">
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Naam</p>
                                <p>{selectedSubmission.name}</p>
                              </div>
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Email</p>
                                <p>
                                  <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 underline">
                                    {selectedSubmission.email}
                                  </a>
                                </p>
                              </div>
                              {selectedSubmission.subject && (
                                <div>
                                  <p className="font-black uppercase text-sm mb-1">Onderwerp</p>
                                  <p>{selectedSubmission.subject}</p>
                                </div>
                              )}
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Bericht</p>
                                <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                              </div>
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Status</p>
                                {getStatusBadge(selectedSubmission.status)}
                              </div>
                              <div>
                                <p className="font-black uppercase text-sm mb-1">Datum</p>
                                <p>{formatDate(selectedSubmission.created_at)}</p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => updateStatus(selectedSubmission.id, "replied")}
                                  variant="outline"
                                  className="font-black"
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Markeer als Beantwoord
                                </Button>
                                <Button
                                  onClick={() => updateStatus(selectedSubmission.id, "archived")}
                                  variant="outline"
                                  className="font-black"
                                >
                                  Archiveer
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {(!submission.status || submission.status === "new") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(submission.id)}
                          className="font-black"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Lees
                        </Button>
                      )}
                    </div>
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

