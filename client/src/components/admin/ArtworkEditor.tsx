import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { artworkSchema, type ArtworkFormData } from "@/lib/validations";
import { Artwork, ArtworkCategory, ProductType } from "@/types";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Trash2, Edit2, Shirt, Coffee, Book, Image as ImageIcon, Frame, Tag, ShoppingBag, Upload, Download, X, File } from "lucide-react";

interface ArtworkEditorProps {
  artwork?: Artwork;
  onSave: () => void;
  onCancel: () => void;
  onArtworkUpdate?: (artwork: Artwork) => void;
}

export function ArtworkEditor({ artwork, onSave, onCancel, onArtworkUpdate }: ArtworkEditorProps) {
  const { sessionId } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [digitalFilePreview, setDigitalFilePreview] = useState<string | null>(null);
  const [currentDigitalFile, setCurrentDigitalFile] = useState<string | undefined>(artwork?.digitalFile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: artwork
      ? {
          title: artwork.title,
          image: artwork.image,
          category: artwork.category,
          description: artwork.description || "",
          available: artwork.available ?? true,
          rotation: artwork.rotation,
          availableProducts: artwork.availableProducts || [],
        }
      : {
          available: true,
          availableProducts: [],
        },
  });

  // Update form when artwork changes
  useEffect(() => {
    if (artwork) {
      reset({
        title: artwork.title,
        image: artwork.image,
        category: artwork.category,
        description: artwork.description || "",
        available: artwork.available ?? true,
        rotation: artwork.rotation,
        availableProducts: artwork.availableProducts || [],
      });
      // Also update current digital file state
      setCurrentDigitalFile(artwork.digitalFile);
    } else {
      // Reset form for new artwork
      reset({
        available: true,
        availableProducts: [],
      });
      setCurrentDigitalFile(undefined);
      setDigitalFilePreview(null);
    }
  }, [artwork, reset]);

  const availableProducts = watch("availableProducts") || [];
  
  const productTypes: { type: ProductType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: "tshirt", label: "T-shirt", icon: Shirt },
    { type: "mug", label: "Mok", icon: Coffee },
    { type: "notebook", label: "Notebook", icon: Book },
    { type: "poster", label: "Poster", icon: ImageIcon },
    { type: "canvas", label: "Canvas", icon: Frame },
    { type: "sticker", label: "Sticker", icon: Tag },
    { type: "tote-bag", label: "Tote bag", icon: ShoppingBag },
  ];

  const toggleProductType = (productType: ProductType) => {
    const current = availableProducts || [];
    const updated = current.includes(productType)
      ? current.filter((p) => p !== productType)
      : [...current, productType];
    setValue("availableProducts", updated);
  };

  const category = watch("category");
  const imageFileName = watch("image");
  const rotation = watch("rotation") || 0;

  // Update current digital file when artwork changes
  useEffect(() => {
    if (!artwork) {
      setCurrentDigitalFile(undefined);
      setDigitalFilePreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
      return;
    }

    const digitalFile = artwork.digitalFile;
    setCurrentDigitalFile(digitalFile);
    
    // Cleanup previous preview URL first
    setDigitalFilePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    
    // Load preview for existing digital file if it's an image
    let cancelled = false;
    if (digitalFile && artwork.id && sessionId) {
      const fileExt = digitalFile.split('.').pop()?.toLowerCase();
      const imageExtensions = ['png', 'jpg', 'jpeg', 'svg'];
      
      if (fileExt && imageExtensions.includes(fileExt)) {
        // Load preview from download endpoint
        fetch(`/api/artworks/${artwork.id}/digital-file`, {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        })
          .then((response) => {
            if (cancelled) return null;
            if (response.ok) {
              return response.blob();
            }
            throw new Error('Failed to load preview');
          })
          .then((blob) => {
            if (cancelled || !blob) return;
            setDigitalFilePreview((prev) => {
              // Cleanup previous
              if (prev && prev.startsWith('blob:')) {
                URL.revokeObjectURL(prev);
              }
              return URL.createObjectURL(blob);
            });
          })
          .catch((error) => {
            if (!cancelled) {
              console.error('Error loading digital file preview:', error);
              setDigitalFilePreview(null);
            }
          });
      }
    }
    
    // Cleanup function
    return () => {
      cancelled = true;
      setDigitalFilePreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
    };
  }, [artwork, sessionId]);

  const handleDigitalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!artwork?.id) {
      setError("Kunstwerk moet eerst opgeslagen worden voordat je een digitaal bestand kunt uploaden");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "application/pdf", "application/postscript"];
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".svg", ".pdf", ".ai", ".eps"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt)) {
      setError("Bestandstype niet toegestaan. Toegestane types: PNG, JPG, SVG, PDF, AI, EPS");
      event.target.value = "";
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("Bestand is te groot. Maximum grootte: 50MB");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("digitalFile", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status === 200) {
          const result = await JSON.parse(xhr.responseText);
          setCurrentDigitalFile(result.filename);
          
          // Update artwork data if callback is provided
          if (onArtworkUpdate && result.artwork) {
            onArtworkUpdate(result.artwork);
          }
          
          // Create preview for images
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setDigitalFilePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            setDigitalFilePreview(null);
          }

          setUploadProgress(100);
          setTimeout(() => {
            setUploadProgress(0);
            setUploading(false);
          }, 1000);
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            setError(errorData.error || "Upload mislukt");
          } catch {
            setError("Upload mislukt. Onbekende fout.");
          }
          setUploading(false);
          setUploadProgress(0);
        }
      });

      xhr.addEventListener("error", () => {
        setError("Upload mislukt. Controleer je internetverbinding.");
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener("abort", () => {
        setError("Upload geannuleerd.");
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open("POST", `/api/artworks/${artwork.id}/upload-digital`);
      xhr.setRequestHeader("Authorization", `Bearer ${sessionId}`);
      xhr.send(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden bij het uploaden");
      setUploading(false);
      setUploadProgress(0);
      event.target.value = "";
    }
  };

  const handleDownloadDigitalFile = async () => {
    if (!artwork?.id || !currentDigitalFile) return;
    
    try {
      const response = await fetch(`/api/artworks/${artwork.id}/digital-file`, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error("Download mislukt");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentDigitalFile;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download mislukt");
    }
  };

  const handleDeleteDigitalFile = async () => {
    if (!artwork?.id || !currentDigitalFile) return;
    
    if (!confirm("Weet je zeker dat je het digitale bestand wilt verwijderen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/artworks/${artwork.id}/digital-file`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Verwijderen mislukt");
      }

      const result = await response.json().catch(() => ({}));
      
      // Update artwork data if callback is provided
      if (onArtworkUpdate && result.artwork) {
        onArtworkUpdate(result.artwork);
      }

      setCurrentDigitalFile(undefined);
      setDigitalFilePreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden bij het verwijderen");
    }
  };

  const onSubmit = async (data: ArtworkFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const url = artwork ? `/api/artworks/${artwork.id}` : "/api/artworks";
      const method = artwork ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save artwork");
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border-4 border-red-500 text-red-700 font-black">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">
          Titel <span className="text-red-600">*</span>
        </Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Kunstwerk titel"
          className="font-mono"
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">
          Afbeelding bestandsnaam <span className="text-red-600">*</span>
        </Label>
        <Input
          id="image"
          {...register("image")}
          placeholder="image.jpg"
          className="font-mono"
        />
        {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
        <p className="text-xs text-gray-600">
          Bestandsnaam van de afbeelding in /public/images/
        </p>
        
        {/* Image Preview */}
        {imageFileName && (
          <div className="mt-4 p-4 border-4 border-black bg-gray-50">
            <Label className="text-sm font-black uppercase mb-2 block">Preview:</Label>
            <div className="relative w-full h-64 overflow-hidden bg-gray-200 flex items-center justify-center">
              <img
                src={`/images/${imageFileName}`}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                style={{ transform: `rotate(${rotation}deg)` }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".error-message")) {
                    const errorDiv = document.createElement("div");
                    errorDiv.className = "error-message text-gray-500 font-mono text-sm";
                    errorDiv.textContent = "Afbeelding niet gevonden";
                    parent.appendChild(errorDiv);
                  }
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "block";
                  const parent = target.parentElement;
                  const errorMsg = parent?.querySelector(".error-message");
                  if (errorMsg) {
                    errorMsg.remove();
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">
          Categorie <span className="text-red-600">*</span>
        </Label>
        <Select
          value={category}
          onValueChange={(value) => setValue("category", value as ArtworkCategory)}
        >
          <SelectTrigger className="font-mono">
            <SelectValue placeholder="Selecteer categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grafische-kunst">Grafische Kunst</SelectItem>
            <SelectItem value="gedichten">Gedichten</SelectItem>
            <SelectItem value="tekst">Tekst</SelectItem>
            <SelectItem value="combinatie">Combinatie</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschrijving (optioneel)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Beschrijving van het kunstwerk..."
          rows={4}
          className="font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rotation">Rotatie (graden, optioneel)</Label>
        <Input
          id="rotation"
          type="number"
          {...register("rotation", { valueAsNumber: true })}
          placeholder="0"
          className="font-mono"
        />
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id="available"
          {...register("available")}
          checked={watch("available")}
          onCheckedChange={(checked) => setValue("available", checked === true)}
        />
        <Label htmlFor="available" className="cursor-pointer">
          Beschikbaar voor bestelling
        </Label>
      </div>

      <div className="space-y-3 pt-4 border-t-4 border-black">
        <Label className="text-base font-black uppercase">
          Beschikbare product types
        </Label>
        <p className="text-xs text-gray-600 font-mono">
          Selecteer de product types waarop dit kunstwerk beschikbaar is
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {productTypes.map(({ type, label, icon: Icon }) => (
            <label
              key={type}
              className="flex items-center space-x-2 p-3 border-2 border-black rounded cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={availableProducts.includes(type)}
                onCheckedChange={() => toggleProductType(type)}
              />
              <Icon className="w-4 h-4" />
              <span className="text-sm font-mono">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Digital File Upload Section */}
      {artwork && (
        <div className="space-y-3 pt-4 border-t-4 border-black">
          <Label className="text-base font-black uppercase">
            Digitaal bestand voor print-on-demand
          </Label>
          <p className="text-xs text-gray-600 font-mono">
            Upload een digitaal bestand (PNG, JPG, SVG, PDF, AI, EPS) dat gebruikt wordt voor print-on-demand producten. Max 50MB.
          </p>

          {currentDigitalFile ? (
            <div className="space-y-3 p-4 border-4 border-black bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <File className="w-5 h-5" />
                  <span className="font-mono text-sm">{currentDigitalFile}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={handleDownloadDigitalFile}
                    variant="outline"
                    size="sm"
                    className="font-black"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDeleteDigitalFile}
                    variant="outline"
                    size="sm"
                    className="font-black text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Verwijder
                  </Button>
                </div>
              </div>

              {/* Preview for images */}
              {digitalFilePreview && (
                <div className="mt-3 p-3 border-2 border-black bg-white">
                  <Label className="text-xs font-black uppercase mb-2 block">Preview:</Label>
                  <img
                    src={digitalFilePreview}
                    alt="Digital file preview"
                    className="max-w-full max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="file"
                  id="digitalFile"
                  accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps,image/png,image/jpeg,image/svg+xml,application/pdf,application/postscript"
                  onChange={handleDigitalFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Label
                  htmlFor="digitalFile"
                  className={`flex items-center justify-center space-x-2 p-4 border-4 border-dashed border-black rounded cursor-pointer transition-colors ${
                    uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-black uppercase">
                    {uploading ? "Uploaden..." : "Selecteer digitaal bestand"}
                  </span>
                </Label>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 font-mono text-center">
                    {Math.round(uploadProgress)}% geüpload
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4 border-t-4 border-black">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="font-black"
        >
          Annuleren
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white hover:bg-gray-800 font-black"
        >
          {isSubmitting ? "Opslaan..." : artwork ? "Bijwerken" : "Aanmaken"}
        </Button>
      </div>
    </form>
  );
}

interface ArtworkListProps {
  artworks: Artwork[];
  onEdit: (artwork: Artwork) => void;
  onDelete: (id: string) => void;
}

export function ArtworkList({ artworks, onEdit, onDelete }: ArtworkListProps) {
  const { sessionId } = useAdminAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit kunstwerk wilt verwijderen?")) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/artworks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete artwork");
      }

      onDelete(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Verwijderen mislukt");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {artworks.length === 0 ? (
        <p className="text-gray-600 font-mono">Geen kunstwerken gevonden.</p>
      ) : (
        <div className="grid gap-4">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="industrial-box p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-xl font-black uppercase">{artwork.title}</h3>
                <p className="text-sm text-gray-600 font-mono">
                  {artwork.category} • {artwork.available ? "Beschikbaar" : "Niet beschikbaar"}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => onEdit(artwork)}
                  variant="outline"
                  size="icon"
                  className="font-black"
                >
                  <Edit2 />
                </Button>
                <Button
                  onClick={() => handleDelete(artwork.id)}
                  variant="outline"
                  size="icon"
                  disabled={deletingId === artwork.id}
                  className="font-black text-red-600 hover:text-red-700"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

