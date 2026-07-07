"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Mail,
  Phone,
  MapPin,
  Printer,
  Calendar,
  Award,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Languages,
  User,
  Briefcase,
  Sparkles,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

/* ── Custom Cursor ──────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const move = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "none" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.28, ease: "power2.out" });
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, .interactive-card")) {
        gsap.to(ring, { scale: 1.8, opacity: 0.25, duration: 0.25 });
        gsap.to(dot, { scale: 0.5, duration: 0.2 });
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, .interactive-card")) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.28 });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ── CV PAGE ────────────────────────────────────────────────────── */
export default function CVPage() {
  const [isInteractive, setIsInteractive] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [theme, setTheme] = useState<"gold" | "emerald" | "indigo">("gold");
  const containerRef = useRef<HTMLDivElement>(null);

  // Check search query parameters to force print layout
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("print") === "true") {
        setIsInteractive(false);
      }
    }
  }, []);

  // Entrance animations on mount
  useEffect(() => {
    if (isInteractive) {
      gsap.from(".animate-cv-up", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
    }
  }, [isInteractive]);

  // Skill description mapping
  const skillDetails: Record<string, { title: string; desc: string }> = {
    teamwork: {
      title: "Travail en équipe & Entraide",
      desc: "Capacité éprouvée à coopérer efficacement avec les équipiers (cuisine, comptoir) en période de forte affluence (rushs) pour maintenir un service fluide et rapide.",
    },
    customer: {
      title: "Sens de l'accueil & Service Client",
      desc: "Aisance relationnelle innée, sourire chaleureux et écoute active pour accueillir la clientèle avec amabilité, gérer les commandes avec efficacité et traiter les demandes positives.",
    },
    organization: {
      title: "Organisation & Gestion du stress",
      desc: "Excellente aptitude à prioriser les tâches. L'exigence de ma Licence de Physique m'a appris à planifier rigoureusement mon temps et à rester concentrée sous pression.",
    },
    hygiene: {
      title: "Rigueur & Respect des normes",
      desc: "Sens du détail développé. Engagement absolu à appliquer avec rigueur les consignes de sécurité sanitaire, de propreté et les normes d'hygiène alimentaire de l'enseigne.",
    },
    adaptability: {
      title: "Adaptabilité & Rapidité d'assimilation",
      desc: "Grande réactivité pour s'adapter rapidement aux différents postes (caisse, préparation, comptoir) et apprendre les procédures d'exploitation McDonald's.",
    },
  };

  // Theme-specific styles
  const themes = {
    gold: {
      accent: "#D4AF37",
      accentHover: "#b8942b",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200/50",
      accentText: "text-amber-600",
      borderAccent: "border-amber-500",
      glowBg: "from-amber-500/10 to-orange-500/5",
      btnBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20",
    },
    emerald: {
      accent: "#10B981",
      accentHover: "#059669",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
      accentText: "text-emerald-600",
      borderAccent: "border-emerald-500",
      glowBg: "from-emerald-500/10 to-teal-500/5",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
    },
    indigo: {
      accent: "#6366F1",
      accentHover: "#4F46E5",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
      accentText: "text-indigo-600",
      borderAccent: "border-indigo-500",
      glowBg: "from-indigo-500/10 to-purple-500/5",
      btnBg: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20",
    },
  };

  const activeTheme = themes[theme];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Dynamic Cursor for web devices */}
      <CustomCursor />

      {/* Global CSS Overrides for Perfect Print Layout on A4 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body {
              background: #ffffff !important;
              color: #000000 !important;
              font-family: 'Geist Sans', sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            .print-layout {
              display: block !important;
              background: #ffffff !important;
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .print-two-col {
              display: grid !important;
              grid-template-columns: 3fr 5fr !important;
              gap: 2rem !important;
            }
            .print-header {
              border-bottom: 2px solid #e5e7eb !important;
              padding-bottom: 1.5rem !important;
              margin-bottom: 1.5rem !important;
            }
            .print-section {
              margin-bottom: 1.5rem !important;
              page-break-inside: avoid !important;
            }
            .print-title {
              color: #111111 !important;
              font-size: 1.25rem !important;
              border-bottom: 1px solid #e5e7eb !important;
              padding-bottom: 0.25rem !important;
              margin-bottom: 0.75rem !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              font-weight: 700 !important;
            }
            .cursor-dot, .cursor-ring {
              display: none !important;
            }
            @page {
              size: A4;
              margin: 1.4cm 1.4cm 1.4cm 1.4cm;
            }
          }
        `,
        }}
      />

      <div
        ref={containerRef}
        className="min-h-screen text-[#111] font-sans relative pb-20 selection:bg-amber-500 selection:text-white"
        style={{
          background: isInteractive ? "#F8F9FA" : "#FFFFFF",
        }}
      >
        {/* Subtle decorative mesh background (web-only) */}
        {isInteractive && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none no-print">
            <div
              className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-[0.45] transition-all duration-1000 bg-gradient-to-br ${activeTheme.glowBg}`}
            />
            <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] rounded-full filter blur-[100px] opacity-[0.25] bg-neutral-200" />
            <div className="absolute inset-0 bg-image-grid opacity-[0.02] pointer-events-none" />
          </div>
        )}

        {/* ── TOP ACTION BAR (no-print) ── */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 no-print">
          <div className="max-w-[1100px] mx-auto px-4 py-3 flex flex-wrap gap-4 items-center justify-between">
            {/* Back button */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Link>

            {/* Middle: layout toggle */}
            <div className="flex bg-neutral-100 p-0.5 rounded-xl border border-neutral-200/50">
              <button
                onClick={() => setIsInteractive(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isInteractive
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Version Interactive
              </button>
              <button
                onClick={() => setIsInteractive(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  !isInteractive
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Aperçu Impression (A4)
              </button>
            </div>

            {/* Right: theme selector + Print */}
            <div className="flex items-center gap-3">
              {isInteractive && (
                <div className="flex gap-1.5 border-r border-neutral-200 pr-3">
                  {(["gold", "emerald", "indigo"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      aria-label={`Thème ${t}`}
                      className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        theme === t
                          ? "border-neutral-800 scale-110"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            t === "gold" ? "#D4AF37" : t === "emerald" ? "#10B981" : "#6366F1",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handlePrint}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md active:scale-95 ${activeTheme.btnBg}`}
              >
                <Printer className="w-4 h-4" />
                Imprimer le CV
              </button>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="max-w-[1000px] mx-auto px-4 pt-8 z-10 relative">
          {isInteractive ? (
            /* ========================================================
               WEB INTERACTIVE LAYOUT
               ======================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar: Details & Info */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Profile Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 border border-neutral-200/50 shadow-xl shadow-neutral-100 flex flex-col items-center text-center animate-cv-up">
                  <div className="relative group mb-5">
                    <div
                      className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 blur-[8px] transition duration-500 bg-gradient-to-tr"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${activeTheme.accent}, #fff, ${activeTheme.accent})`,
                      }}
                    />
                    <img
                      src="/assets/imane_avatar.png"
                      alt="Imane Amakrane"
                      className="w-32 h-32 rounded-full object-cover relative border-4 border-white shadow-inner bg-neutral-100"
                    />
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-1">
                    Imane Amakrane
                  </h1>
                  <p className="text-sm font-semibold tracking-wider uppercase text-neutral-500 mb-6">
                    Candidate Équipière Polyvalente
                  </p>

                  <div className="w-full h-[1px] bg-neutral-100 mb-6" />

                  {/* Quick Contact Links */}
                  <div className="w-full flex flex-col gap-3">
                    <a
                      href="tel:+212777015324"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/30 text-neutral-600 hover:text-black transition-all group text-left"
                    >
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-neutral-200/60 shadow-sm text-neutral-500 group-hover:text-black">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                          Téléphone
                        </span>
                        <span className="text-[13px] font-medium">+212 7 77 01 53 24</span>
                      </div>
                    </a>

                    <a
                      href="mailto:imaneamakrane33@gmail.com"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/30 text-neutral-600 hover:text-black transition-all group text-left"
                    >
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-neutral-200/60 shadow-sm text-neutral-500 group-hover:text-black">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                          Email
                        </span>
                        <span className="text-[13px] font-medium truncate max-w-[160px]">
                          imaneamakrane33@gmail.com
                        </span>
                      </div>
                    </a>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/30 text-neutral-600 text-left">
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-neutral-200/60 shadow-sm text-neutral-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                          Adresse
                        </span>
                        <span className="text-[13px] font-medium">Aswar Meknès 2, Maroc</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recruiter Quick Actions */}
                <div className="bg-neutral-900 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden animate-cv-up">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"
                       style={{ backgroundColor: activeTheme.accent }} />
                  
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                      <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
                      Action Rapide Recruitment
                    </div>
                    
                    <h3 className="text-lg font-bold leading-tight">
                      Contacter Imane directement pour un entretien
                    </h3>
                    
                    <a
                      href="https://wa.me/212777015324?text=Bonjour%20Imane,%20votre%20profil%20de%20Licence%20Physique%20m'intéresse%20pour%20un%20poste%20d'équipière%20chez%20McDonald's.%20Seriez-vous%20disponible%20prochainement%20?"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-semibold text-xs tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.386 9.805-9.79.001-2.618-1.01-5.08-2.858-6.932A9.71 9.71 0 0 0 12.008 2.1c-5.407 0-9.809 4.385-9.811 9.79-.001 1.77.464 3.491 1.353 5.009l-.988 3.606 3.695-.971zM17.47 14.5c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      Contacter sur WhatsApp
                    </a>

                    <a
                      href="mailto:imaneamakrane33@gmail.com?subject=Recrutement%20McDonald's%20-%20Candidature%20Imane%20Amakrane"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-semibold text-xs tracking-wide bg-neutral-800 hover:bg-neutral-700 text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Mail className="w-4 h-4" />
                      Envoyer un Email
                    </a>
                  </div>
                </div>

                {/* Availability Section */}
                <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 border border-neutral-200/50 shadow-xl shadow-neutral-100 animate-cv-up">
                  <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-neutral-400" />
                    Disponibilités Rushes
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/30">
                      <div className="text-xs font-bold text-neutral-800 mb-0.5">En semaine</div>
                      <div className="text-xs text-neutral-500">
                        Soirées à partir de 17h/18h (idéal shifts du soir et fermeture)
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl border border-dashed border-neutral-200"
                         style={{ borderColor: activeTheme.accent }}>
                      <div className="text-xs font-bold text-neutral-800 mb-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.accent }} />
                        Week-ends
                      </div>
                      <div className="text-xs text-neutral-500">
                        Disponibilité totale (Samedi & Dimanche, toute heure)
                      </div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/30">
                      <div className="text-xs font-bold text-neutral-800 mb-0.5">Jours Fériés & Vacances</div>
                      <div className="text-xs text-neutral-500">Disponibilité totale à temps complet</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main CV Sections */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Objective Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 border border-neutral-200/50 shadow-xl shadow-neutral-100 animate-cv-up relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: activeTheme.accent }} />
                  
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    Objectif Professionnel
                  </h3>

                  <p className="text-neutral-600 text-[15px] leading-[1.7] font-medium">
                    Étudiante en première année de Licence Physique à l'Université Moulay Ismail,
                    je suis particulièrement motivée à rejoindre l'équipe de McDonald's en tant
                    qu'équipière polyvalente à temps partiel. Rigoureuse, dynamique et dotée
                    d'un excellent sens de l'accueil, je souhaite mettre mon énergie et mon esprit d'équipe au
                    service de votre établissement reconnu pour son excellence opérationnelle. Je suis impatiente
                    de m'investir pleinement, de relever le défi des périodes de forte affluence avec le sourire,
                    et d'apporter ma contribution à la satisfaction de chaque client, tout en conciliant ce poste
                    avec mes exigences académiques.
                  </p>
                </div>

                {/* Interactive Competences Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 border border-neutral-200/50 shadow-xl shadow-neutral-100 animate-cv-up">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Compétences Clés (Interactif)
                    </h3>
                    <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      Cliquez pour voir
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { key: "teamwork", text: "Travail en équipe & Dynamisme" },
                      { key: "customer", text: "Communication, sourire et accueil client" },
                      { key: "organization", text: "Organisation & Gestion du temps" },
                      { key: "hygiene", text: "Rigueur et respect des normes d'hygiène/sécurité" },
                      { key: "adaptability", text: "Rapidité d'adaptation & Polyvalence" },
                    ].map(item => {
                      const isSelected = selectedSkill === item.key;
                      return (
                        <div key={item.key} className="w-full">
                          <button
                            onClick={() => setSelectedSkill(isSelected ? null : item.key)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                              isSelected
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-lg"
                                : "bg-neutral-50/50 border-neutral-200/50 hover:bg-neutral-50 hover:border-neutral-300 text-neutral-700"
                            }`}
                          >
                            <span className="font-semibold text-sm">{item.text}</span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-all ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-white text-neutral-500 group-hover:text-black border border-neutral-200/50"
                              }`}
                            >
                              {isSelected ? "Fermer" : "Détails"}
                            </span>
                          </button>

                          {/* Smooth expanded area */}
                          {isSelected && (
                            <div className="mt-2 p-4 bg-neutral-100 rounded-2xl text-xs text-neutral-600 leading-relaxed border border-neutral-200/40 animate-fade-in">
                              <p className="font-semibold text-neutral-800 mb-1">
                                {skillDetails[item.key].title}
                              </p>
                              {skillDetails[item.key].desc}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Formations Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 border border-neutral-200/50 shadow-xl shadow-neutral-100 animate-cv-up">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    Formation
                  </h3>

                  <div className="relative border-l border-neutral-100 pl-6 ml-3 flex flex-col gap-6">
                    {/* Formation 1 */}
                    <div className="relative">
                      <div
                        className="absolute -left-[31px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-white"
                        style={{ backgroundColor: activeTheme.accent }}
                      />
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
                          2024 - Présent (2025)
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${activeTheme.badgeBg}`}>
                          Université
                        </span>
                      </div>
                      <h4 className="text-md font-bold text-neutral-800">
                        1ère année Licence en Physique
                      </h4>
                      <p className="text-xs text-neutral-500 mb-2 font-semibold">
                        Université Moulay Ismail, Meknès
                      </p>
                      <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                        Acquisition de méthodes d'analyse rigoureuses, de compétences organisationnelles et
                        de discipline personnelle, particulièrement adaptées au respect des standards stricts de l'enseigne.
                      </p>
                    </div>

                    {/* Formation 2 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-white bg-neutral-400" />
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
                          Obtenu en 2024
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-neutral-50 text-neutral-600 border-neutral-200">
                          Diplôme d'État
                        </span>
                      </div>
                      <h4 className="text-md font-bold text-neutral-800">
                        Baccalauréat Scientifique (Option Physique-Chimie)
                      </h4>
                      <p className="text-xs text-neutral-500 mb-2 font-semibold">
                        Meknès, Maroc
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience & Languages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-cv-up">
                  {/* Languages */}
                  <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 border border-neutral-200/50 shadow-xl shadow-neutral-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-5 flex items-center gap-1.5">
                      <Languages className="w-4 h-4" />
                      Langues
                    </h3>
                    <div className="flex flex-col gap-4">
                      {[
                        { lang: "Arabe", level: "Langue maternelle / Courant", val: "w-[100%]" },
                        { lang: "Français", level: "Intermédiaire supérieur / Aisance relationnelle", val: "w-[75%]" },
                        { lang: "Anglais", level: "Intermédiaire / Accueil de base", val: "w-[60%]" },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm font-semibold text-neutral-800">{item.lang}</span>
                            <span className="text-[11px] text-neutral-400 font-semibold">{item.level}</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{
                                width: item.val.replace("w-[", "").replace("]", ""),
                                backgroundColor: activeTheme.accent,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open to Experience info card */}
                  <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 border border-neutral-200/50 shadow-xl shadow-neutral-100 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        Expérience Professionnelle
                      </h3>
                      <h4 className="text-md font-bold text-neutral-800 mb-2">
                        Première Expérience Professionnelle
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Ouverte à toute première opportunité. Extrêmement motivée, j'apporte un regard neuf,
                        de la ponctualité, de la rigueur et une immense volonté d'apprendre rapidement les process opérationnels.
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Prête à débuter immédiatement
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
               PRINT PREVIEW (A4 LAYOUT SHEET)
               ======================================================== */
            <div className="print-layout bg-white p-12 border border-neutral-200 rounded-lg shadow-xl max-w-[800px] mx-auto min-h-[1100px] flex flex-col justify-between text-black">
              <div>
                {/* Header */}
                <div className="print-header flex justify-between items-start border-b-2 border-neutral-100 pb-6 mb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 uppercase">
                      Imane Amakrane
                    </h1>
                    <p className="text-sm font-bold tracking-wider text-neutral-500 uppercase mt-0.5">
                      Étudiante en Licence Physique &bull; Candidate Équipière Polyvalente
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-600 mt-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Aswar Meknès 2, Meknès
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> 0777015324
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> imaneamakrane33@gmail.com
                      </span>
                    </div>
                  </div>
                  <img
                    src="/assets/imane_avatar.png"
                    alt="Portrait Imane"
                    className="w-24 h-24 rounded-full object-cover border-2 border-neutral-100 shadow-sm"
                  />
                </div>

                {/* Inner Content Grid */}
                <div className="print-two-col grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left smaller column */}
                  <div className="md:col-span-4 flex flex-col gap-6">
                    {/* Skills */}
                    <div className="print-section">
                      <h3 className="print-title text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-3 uppercase tracking-wide">
                        Compétences
                      </h3>
                      <ul className="flex flex-col gap-2.5 text-xs text-neutral-700">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                          <span>Travail en équipe & cohésion</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                          <span>Sens de l'accueil & service client</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                          <span>Organisation & gestion du temps</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                          <span>Respect des consignes & hygiène</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                          <span>Rigueur & rapidité d'adaptation</span>
                        </li>
                      </ul>
                    </div>

                    {/* Langues */}
                    <div className="print-section">
                      <h3 className="print-title text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-3 uppercase tracking-wide">
                        Langues
                      </h3>
                      <ul className="flex flex-col gap-2 text-xs text-neutral-700">
                        <li>
                          <div className="font-semibold text-neutral-900">Arabe</div>
                          <div className="text-[10px] text-neutral-500">Langue maternelle</div>
                        </li>
                        <li>
                          <div className="font-semibold text-neutral-900">Français</div>
                          <div className="text-[10px] text-neutral-500">Courant / Intermédiaire supérieur</div>
                        </li>
                        <li>
                          <div className="font-semibold text-neutral-900">Anglais</div>
                          <div className="text-[10px] text-neutral-500">Intermédiaire</div>
                        </li>
                      </ul>
                    </div>

                    {/* Disponibilités */}
                    <div className="print-section">
                      <h3 className="print-title text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-3 uppercase tracking-wide">
                        Disponibilités
                      </h3>
                      <ul className="flex flex-col gap-2 text-xs text-neutral-700">
                        <li>
                          <div className="font-semibold text-neutral-900">En semaine</div>
                          <div className="text-[10px] text-neutral-500">Soirées (dès 17h/18h)</div>
                        </li>
                        <li>
                          <div className="font-semibold text-neutral-900">Week-ends</div>
                          <div className="text-[10px] text-neutral-500">Disponibilité totale</div>
                        </li>
                        <li>
                          <div className="font-semibold text-neutral-900">Jours Fériés & Vacances</div>
                          <div className="text-[10px] text-neutral-500">Disponibilité totale</div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Right wider column */}
                  <div className="md:col-span-8 flex flex-col gap-6">
                    {/* Profil/Objectif */}
                    <div className="print-section">
                      <h3 className="print-title text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-3 uppercase tracking-wide">
                        Objectif Professionnel
                      </h3>
                      <p className="text-xs text-neutral-700 leading-[1.6]">
                        Étudiante en première année de Licence Physique à l'Université Moulay Ismail de Meknès,
                        je recherche un emploi d'équipière polyvalente à temps partiel chez McDonald's. Motivée,
                        ponctuelle et dynamique, je possède un excellent relationnel et une grande capacité d'adaptation.
                        Je souhaite mettre ma rigueur académique et mon sens du travail en équipe au service de la
                        satisfaction des clients, tout en conciliant ce poste avec mes exigences d'études.
                      </p>
                    </div>

                    {/* Formation */}
                    <div className="print-section">
                      <h3 className="print-title text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-3 uppercase tracking-wide">
                        Formation
                      </h3>
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-neutral-800">
                              1ère année Licence en Physique
                            </span>
                            <span className="text-[10px] font-bold text-neutral-500">
                              2024 - 2025
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-semibold">
                            Université Moulay Ismail, Meknès
                          </div>
                          <p className="text-[10px] text-neutral-600 mt-1">
                            Développement de la méthode de travail rigoureuse, de la gestion du temps et du stress.
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-neutral-800">
                              Baccalauréat Scientifique (Série Physique-Chimie)
                            </span>
                            <span className="text-[10px] font-bold text-neutral-500">
                              2024
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-semibold">
                            Meknès, Maroc
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expérience */}
                    <div className="print-section">
                      <h3 className="print-title text-sm font-bold text-neutral-800 border-b border-neutral-200 pb-1 mb-3 uppercase tracking-wide">
                        Expérience Professionnelle
                      </h3>
                      <div>
                        <div className="font-bold text-xs text-neutral-800">
                          Première expérience professionnelle
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 leading-[1.6]">
                          Actuellement ouverte à ma première opportunité professionnelle. Motivée par l'apprentissage
                          de nouvelles procédures, le service client de qualité et l'investissement au sein d'une équipe dynamique.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Print Footer */}
              <div className="border-t border-neutral-100 pt-3 mt-8 text-center text-[9px] text-neutral-400">
                Document généré professionnellement &bull; Disponible en version numérique interactive à l'adresse URL du portfolio
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
