import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/admin/LoginForm";
import { ArtworkEditor, ArtworkList } from "@/components/admin/ArtworkEditor";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Artwork } from "@/types";
import { LogOut, Plus } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, logout, sessionId } = useAdminAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | undefined>();
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchArtworks();
    }
  }, [isAuthenticated]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/artworks");
      if (!response.ok) {
        throw new Error("Failed to fetch artworks");
      }
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      alert("Fout bij ophalen van kunstwerken");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/admin");
  };

  const handleCreate = () => {
    setEditingArtwork(undefined);
    setShowEditor(true);
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setShowEditor(true);
  };

  const handleArtworkUpdate = (updatedArtwork: Artwork) => {
    // Update the artwork in the list
    setArtworks((prev) =>
      prev.map((a) => (a.id === updatedArtwork.id ? updatedArtwork : a))
    );
    // Update the editing artwork if it's the same one
    if (editingArtwork?.id === updatedArtwork.id) {
      setEditingArtwork(updatedArtwork);
    }
  };

  const handleDelete = (id: string) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = async () => {
    await fetchArtworks();
    setShowEditor(false);
    setEditingArtwork(undefined);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingArtwork(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-mono text-xl">Laden...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-black uppercase mb-2">Admin Dashboard</h1>
            <p className="text-lg font-mono text-gray-700">Beheer je kunstwerken</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="font-black"
          >
            <LogOut className="mr-2" />
            Uitloggen
          </Button>
        </div>

        {showEditor ? (
          <div className="industrial-box p-8">
            <h2 className="text-3xl font-black uppercase mb-6">
              {editingArtwork ? "Kunstwerk bewerken" : "Nieuw kunstwerk"}
            </h2>
            <ArtworkEditor
              artwork={editingArtwork}
              onSave={handleSave}
              onCancel={handleCancel}
              onArtworkUpdate={handleArtworkUpdate}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={handleCreate}
                className="bg-black text-white hover:bg-gray-800 font-black"
              >
                <Plus className="mr-2" />
                Nieuw Kunstwerk
              </Button>
            </div>

            {loading ? (
              <p className="font-mono text-center py-12">Kunstwerken laden...</p>
            ) : (
              <div className="industrial-box p-8">
                <h2 className="text-3xl font-black uppercase mb-6">Kunstwerken</h2>
                <ArtworkList
                  artworks={artworks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

