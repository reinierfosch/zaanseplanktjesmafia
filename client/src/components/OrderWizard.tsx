import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { orderRequestSchema, type OrderRequestFormData } from "@/lib/validations";
import { OrderType, type Artwork, ProductType } from "@/types";
import { ChevronLeft, ChevronRight, Mail, Shirt, Coffee, Book, Image as ImageIcon, Frame, Tag, ShoppingBag } from "lucide-react";

interface OrderWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork?: Artwork;
}

const STEPS = [
  { id: 1, title: "Type selectie" },
  { id: 2, title: "Opties" },
  { id: 3, title: "Inspiratie" },
  { id: 4, title: "Contactgegevens" },
  { id: 5, title: "Bevestiging" },
];

export function OrderWizard({ open, onOpenChange, artwork }: OrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderType, setOrderType] = useState<OrderType | ProductType | null>(null);
  const [derivativeOptions, setDerivativeOptions] = useState({
    thinnerWood: false,
    differentFinish: false,
    fewerColors: false,
  });
  const [inspiration, setInspiration] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailLink, setEmailLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrderRequestFormData>({
    resolver: zodResolver(orderRequestSchema),
    mode: "onBlur",
  });

  // Reset wizard when artwork changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      // Reset when dialog opens
      setCurrentStep(1);
      setOrderType(null);
      setDerivativeOptions({ thinnerWood: false, differentFinish: false, fewerColors: false });
      setInspiration("");
      setSubmitted(false);
      setEmailLink(null);
      reset();
    }
  }, [open, artwork?.id, reset]);

  const handleOrderTypeSelect = (type: OrderType | ProductType) => {
    setOrderType(type);
    // Skip to appropriate step based on order type
    if (type === "derivative") {
      setCurrentStep(2); // Go to options
    } else if (type === "custom") {
      setCurrentStep(3); // Go to inspiration
    } else {
      // For original or any product type, skip to contact info
      setCurrentStep(4);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      let nextStep = currentStep + 1;
      
      // Skip steps that don't apply to current order type
      const isProductType = orderType && ["tshirt", "mug", "notebook", "poster", "canvas", "sticker", "tote-bag"].includes(orderType);
      if (orderType === "original" || isProductType) {
        // Skip steps 2 (options) and 3 (inspiration)
        if (nextStep === 2 || nextStep === 3) {
          nextStep = 4;
        }
      } else if (orderType === "derivative") {
        // Skip step 3 (inspiration)
        if (nextStep === 3) {
          nextStep = 4;
        }
      } else if (orderType === "custom") {
        // Skip step 2 (options)
        if (nextStep === 2) {
          nextStep = 3;
        }
      }
      
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      let prevStep = currentStep - 1;
      
      // Skip steps that don't apply to current order type
      const isProductType = orderType && ["tshirt", "mug", "notebook", "poster", "canvas", "sticker", "tote-bag"].includes(orderType);
      if (orderType === "original" || isProductType) {
        // Skip steps 2 (options) and 3 (inspiration)
        if (prevStep === 3 || prevStep === 2) {
          prevStep = 1;
        }
      } else if (orderType === "derivative") {
        // Skip step 3 (inspiration)
        if (prevStep === 3) {
          prevStep = 2;
        }
      } else if (orderType === "custom") {
        // Skip step 2 (options)
        if (prevStep === 2) {
          prevStep = 1;
        }
      }
      
      setCurrentStep(prevStep);
    }
  };

  const onSubmit = async (data: OrderRequestFormData) => {
    try {
      const orderData = {
        artworkId: artwork?.id,
        orderType: orderType!,
        options: orderType === "derivative" ? derivativeOptions : undefined,
        inspiration: orderType === "custom" ? inspiration : undefined,
        contactInfo: data.contactInfo,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit order");
      }

      const result = await response.json();
      setEmailLink(result.emailLink);
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(error instanceof Error ? error.message : "Er is een fout opgetreden");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentStep(1);
      setOrderType(null);
      setDerivativeOptions({ thinnerWood: false, differentFinish: false, fewerColors: false });
      setInspiration("");
      setSubmitted(false);
      setEmailLink(null);
      reset();
      onOpenChange(false);
    }
  };

  const orderTypeLabels: Record<OrderType | ProductType, string> = {
    original: "Origineel werk",
    derivative: "Afgeleide versie",
    tshirt: "T-shirt print",
    custom: "Custom origineel",
    mug: "Mok print",
    notebook: "Notebook print",
    poster: "Poster print",
    canvas: "Canvas print",
    sticker: "Sticker print",
    "tote-bag": "Tote bag print",
  };

  const productTypeIcons: Record<ProductType, React.ComponentType<{ className?: string }>> = {
    tshirt: Shirt,
    mug: Coffee,
    notebook: Book,
    poster: ImageIcon,
    canvas: Frame,
    sticker: Tag,
    "tote-bag": ShoppingBag,
  };

  const productTypeLabels: Record<ProductType, string> = {
    tshirt: "T-shirt",
    mug: "Mok",
    notebook: "Notebook",
    poster: "Poster",
    canvas: "Canvas",
    sticker: "Sticker",
    "tote-bag": "Tote bag",
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase">
            Bestel {artwork?.title || "Kunstwerk"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-black ${
                  currentStep >= step.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
              >
                {step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? "bg-black" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="text-6xl">✓</div>
              <h3 className="text-2xl font-black uppercase">Bestelling verzonden!</h3>
              <p className="text-gray-700">
                Je bestelling is ontvangen. We nemen zo spoedig mogelijk contact met je op.
              </p>
            </div>
            {emailLink && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Of stuur direct een email met je verzoek:
                </p>
                <Button
                  asChild
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  <a href={emailLink} target="_blank" rel="noopener noreferrer">
                    <Mail className="mr-2" />
                    Open email client
                  </a>
                </Button>
              </div>
            )}
            <Button
              onClick={handleClose}
              className="w-full bg-gray-200 text-black hover:bg-gray-300"
            >
              Sluiten
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Order Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase mb-4">Selecteer type bestelling</h3>
                <div className="space-y-4">
                  {/* Standard order types */}
                  <div className="grid grid-cols-2 gap-4">
                    {(["original", "derivative", "custom"] as OrderType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleOrderTypeSelect(type)}
                        className={`p-6 border-4 rounded-lg text-left transition-all ${
                          orderType === type
                            ? "border-black bg-black text-white"
                            : "border-black hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-black text-lg uppercase">{orderTypeLabels[type]}</div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Product type options if available */}
                  {artwork?.availableProducts && artwork.availableProducts.length > 0 && (
                    <div className="space-y-2 pt-4 border-t-4 border-black">
                      <p className="text-sm font-mono text-gray-600 mb-3">
                        Ook beschikbaar op:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {artwork.availableProducts.map((productType) => {
                          const Icon = productTypeIcons[productType];
                          return (
                            <button
                              key={productType}
                              type="button"
                              onClick={() => {
                                // Set the actual product type as order type
                                handleOrderTypeSelect(productType);
                              }}
                              className={`p-4 border-4 rounded-lg flex items-center space-x-3 transition-all ${
                                orderType === productType
                                  ? "border-black bg-black text-white"
                                  : "border-black hover:bg-gray-100"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-black text-sm uppercase">
                                {productTypeLabels[productType]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Derivative Options */}
            {currentStep === 2 && orderType === "derivative" && (
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase mb-4">Kies je opties</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={derivativeOptions.thinnerWood}
                      onCheckedChange={(checked) =>
                        setDerivativeOptions((prev) => ({ ...prev, thinnerWood: checked === true }))
                      }
                    />
                    <span className="font-mono">Dunner hout</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={derivativeOptions.differentFinish}
                      onCheckedChange={(checked) =>
                        setDerivativeOptions((prev) => ({
                          ...prev,
                          differentFinish: checked === true,
                        }))
                      }
                    />
                    <span className="font-mono">Andere afwerking</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={derivativeOptions.fewerColors}
                      onCheckedChange={(checked) =>
                        setDerivativeOptions((prev) => ({ ...prev, fewerColors: checked === true }))
                      }
                    />
                    <span className="font-mono">Minder kleuren</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Inspiration */}
            {currentStep === 3 && orderType === "custom" && (
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase mb-4">Jouw inspiratie</h3>
                <div className="space-y-2">
                  <Label htmlFor="inspiration">Beschrijf je idee of inspiratie</Label>
                  <Textarea
                    id="inspiration"
                    value={inspiration}
                    onChange={(e) => setInspiration(e.target.value)}
                    placeholder="Vertel ons over je idee, inspiratie, of wat je in gedachten hebt..."
                    rows={6}
                    className="font-mono"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Contact Info */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase mb-4">Contactgegevens</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Naam <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register("contactInfo.name")}
                      placeholder="Jouw naam"
                      className="font-mono"
                    />
                    {errors.contactInfo?.name && (
                      <p className="text-red-600 text-sm">{errors.contactInfo.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("contactInfo.email")}
                      placeholder="je@email.nl"
                      className="font-mono"
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-red-600 text-sm">{errors.contactInfo.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Extra bericht (optioneel)</Label>
                    <Textarea
                      id="message"
                      {...register("contactInfo.message")}
                      placeholder="Heb je nog vragen of opmerkingen?"
                      rows={4}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase mb-4">Bevestiging</h3>
                <div className="space-y-3 p-4 border-4 border-black bg-gray-50">
                  <div>
                    <span className="font-black">Kunstwerk:</span> {artwork?.title || "Niet gespecificeerd"}
                  </div>
                  <div>
                    <span className="font-black">Type:</span> {orderType && orderTypeLabels[orderType]}
                  </div>
                  {orderType === "derivative" && (
                    <div>
                      <span className="font-black">Opties:</span>{" "}
                      {Object.entries(derivativeOptions)
                        .filter(([_, value]) => value)
                        .map(([key]) => {
                          const labels: Record<string, string> = {
                            thinnerWood: "Dunner hout",
                            differentFinish: "Andere afwerking",
                            fewerColors: "Minder kleuren",
                          };
                          return labels[key];
                        })
                        .join(", ") || "Geen"}
                    </div>
                  )}
                  {orderType === "custom" && inspiration && (
                    <div>
                      <span className="font-black">Inspiratie:</span> {inspiration}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Controleer je gegevens en klik op "Verzenden" om je bestelling te plaatsen.
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 border-t-4 border-black">
              <Button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                variant="outline"
                className="font-black"
              >
                <ChevronLeft className="mr-2" />
                Terug
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !orderType) ||
                    (currentStep === 3 && orderType === "custom" && !inspiration.trim())
                  }
                  className="bg-black text-white hover:bg-gray-800 font-black"
                >
                  Volgende
                  <ChevronRight className="ml-2" />
                </Button>
              ) : currentStep === 4 ? (
                <Button
                  type="button"
                  onClick={() => {
                    // Trigger form validation before going to confirmation
                    const form = document.querySelector('form');
                    if (form) {
                      const isValid = form.checkValidity();
                      if (isValid) {
                        handleNext();
                      } else {
                        form.reportValidity();
                      }
                    } else {
                      handleNext();
                    }
                  }}
                  className="bg-black text-white hover:bg-gray-800 font-black"
                >
                  Bevestigen
                  <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white hover:bg-gray-800 font-black"
                >
                  {isSubmitting ? "Verzenden..." : "Verzenden"}
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

