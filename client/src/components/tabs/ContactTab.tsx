import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations";

interface ContactTabProps {
  onSubmitNewsletter?: (email: string, name?: string) => Promise<void>;
}

export function ContactTab({ onSubmitNewsletter }: ContactTabProps) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError: setFormError,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: "onBlur",
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      if (onSubmitNewsletter) {
        await onSubmitNewsletter(data.email, data.name);
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        // Fallback for when no handler is provided
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Er is een fout opgetreden. Probeer het later opnieuw.";
      setFormError("root", { message: errorMessage });
    }
  };

  return (
    <section 
      className="relative min-h-screen py-24 bg-white"
      role="tabpanel"
      id="tabpanel-contact"
      aria-labelledby="tab-contact"
    >
      <div className="container space-y-12">
        <div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            CONTACT & NIEUWSBRIEF
          </h2>
          <p className="text-lg font-mono text-gray-700">
            Neem contact op of meld je aan voor updates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="industrial-box p-8 space-y-4">
              <h3 className="text-2xl font-black uppercase">CONTACTGEGEVENS</h3>
              
              <div className="space-y-6 pt-4 border-t-4 border-black">
                <div>
                  <p className="font-black text-sm uppercase text-gray-600 mb-2">Email</p>
                  <p className="font-mono text-xl">
                    <a 
                      href="mailto:info@plankjesmaffia.nl" 
                      className="hover:text-orange-600 transition-colors"
                      aria-label="Stuur een email naar info@plankjesmaffia.nl"
                    >
                      info@plankjesmaffia.nl
                    </a>
                  </p>
                </div>

                <div>
                  <p className="font-black text-sm uppercase text-gray-600 mb-2">Locatie</p>
                  <p className="font-mono text-lg">
                    Zaandam, Nederland
                  </p>
                </div>

                <div>
                  <p className="font-black text-sm uppercase text-gray-600 mb-2">Volg Ons</p>
                  <nav className="flex gap-4" aria-label="Social media links">
                    <a 
                      href="#" 
                      className="font-mono font-bold hover:text-orange-600 transition-colors"
                      aria-label="Bekijk ons Instagram profiel"
                    >
                      Instagram
                    </a>
                    <a 
                      href="#" 
                      className="font-mono font-bold hover:text-orange-600 transition-colors"
                      aria-label="Bekijk ons TikTok profiel"
                    >
                      TikTok
                    </a>
                    <a 
                      href="#" 
                      className="font-mono font-bold hover:text-orange-600 transition-colors"
                      aria-label="Bekijk ons Facebook profiel"
                    >
                      Facebook
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="industrial-box p-8 space-y-6">
            <h3 className="text-2xl font-black uppercase">ABONNEER OP NIEUWSBRIEF</h3>
            
            <p className="font-mono text-lg text-gray-700">
              Ontvang updates over nieuwe kunstwerken, workshops en exclusieve aanbiedingen.
            </p>

            <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label 
                  htmlFor="newsletter-name" 
                  className="font-black text-sm uppercase text-gray-600"
                >
                  Naam
                </label>
                <input
                  id="newsletter-name"
                  type="text"
                  placeholder="Jouw naam"
                  {...register("name")}
                  className={`w-full px-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  aria-required="false"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "newsletter-name-error" : undefined}
                />
                {errors.name && (
                  <p 
                    id="newsletter-name-error" 
                    className="text-red-600 text-sm font-mono" 
                    role="alert"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="newsletter-email" 
                  className="font-black text-sm uppercase text-gray-600"
                >
                  Email <span className="text-red-600" aria-label="verplicht">*</span>
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="je@email.nl"
                  {...register("email")}
                  className={`w-full px-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={
                    errors.email 
                      ? "newsletter-email-error" 
                      : errors.root 
                        ? "newsletter-error" 
                        : submitted 
                          ? "newsletter-success" 
                          : undefined
                  }
                />
                {errors.email && (
                  <p 
                    id="newsletter-email-error" 
                    className="text-red-600 text-sm font-mono" 
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <p 
                  id="newsletter-error" 
                  className="text-red-600 font-bold text-center" 
                  role="alert"
                  aria-live="polite"
                >
                  {errors.root.message}
                </p>
              )}

              {submitted && (
                <p 
                  id="newsletter-success" 
                  className="text-green-600 font-bold text-center" 
                  role="alert"
                  aria-live="polite"
                >
                  ✓ Je bent ingeschreven!
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white hover:bg-gray-800 border-4 border-black font-black text-lg px-8 py-4 uppercase mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isSubmitting ? "Bezig met verzenden..." : "Abonneer op nieuwsbrief"}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "VERZENDEN..." : "ABONNEER"}
              </Button>
            </form>

            <div className="border-t-4 border-black pt-6 text-center">
              <p className="font-mono text-xs text-gray-600">
                We respecteren je privacy. Geen spam, alleen updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

