import { Workshop } from "@/types";

export const workshops: Workshop[] = [
  {
    id: "1",
    title: "Beginner Workshop",
    desc: "Leer de basis van portrettekenen op hout. Perfect voor beginners!",
    price: "€35 p.p.",
    duration: "2 uur",
    features: ["Alle materialen", "Persoonlijke begeleiding", "Kunstwerk mee naar huis"]
  },
  {
    id: "2",
    title: "Intermediate Workshop",
    desc: "Voeg glitter en kleur toe aan je kunstwerken. Maak het extra speciaal.",
    price: "€45 p.p.",
    duration: "3 uur",
    features: ["Geavanceerde technieken", "Glitter & kleuren", "Professioneel advies"]
  },
  {
    id: "3",
    title: "Advanced Workshop",
    desc: "Creëer je eigen meesterwerk met alle technieken. Voor gevorderden.",
    price: "€55 p.p.",
    duration: "4 uur",
    features: ["Alle technieken", "Custom design", "Portfolio-kwaliteit"]
  }
];

