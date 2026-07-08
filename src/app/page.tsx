"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Star, Eye, Users, TrendingUp,
  Menu, X, Play, Zap, Layers, Clock,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── Custom Cursor ──────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const move = (e: MouseEvent) => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: "none" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.28, ease: "power2.out" });
    };

    // Use event delegation so dynamically added buttons work too
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) {
        gsap.to(ring, { scale: 2.1, opacity: 0.38, duration: 0.25 });
        gsap.to(dot,  { scale: 0.35, duration: 0.2 });
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.28 });
        gsap.to(dot,  { scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ── Magnetic Button ────────────────────────────────────────────── */
function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width  / 2)) * 0.27;
    const y = (e.clientY - (r.top  + r.height / 2)) * 0.27;
    gsap.to(ref.current, { x, y, duration: 0.35, ease: "power2.out" });
  };

  const onMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
  };

  return (
    <button
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ── Work Item Data Type ────────────────────────────────────────── */
interface WorkItem {
  title: string;
  category: string;
  video: string;
  time: string;
  creator: string;
}

/* ── Media base ─────────────────────────────────────────────────────
   Local dev: empty → videos served from /public/assets on disk.
   Production: set NEXT_PUBLIC_MEDIA_BASE_URL to the Vercel Blob origin
   (e.g. https://xxxx.public.blob.vercel-storage.com) so videos load
   from Blob instead of the repo.                                        */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";
const media = (path: string) => `${MEDIA_BASE}${path}`;

/* ── Page ───────────────────────────────────────────────────────── */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  
  // Filtering & pagination states for Selected Work
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  
  // Active video modal state for the lightbox player
  const [activeVideoModal, setActiveVideoModal] = useState<WorkItem | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard accessibility helper for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideoModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero entrance ──────────────────────────────────────────
      gsap.from(".animate-fade-up", {
        y: 60, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power4.out",
      });
      gsap.from(".animate-video", {
        scale: 0.93, opacity: 0, duration: 1.4, delay: 0.3, ease: "power3.out",
      });

      // ── Marquee ────────────────────────────────────────────────
      gsap.from(".animate-marquee-wrap", {
        scrollTrigger: { trigger: ".marquee-section", start: "top 92%" },
        opacity: 0, duration: 0.8, ease: "power2.out",
      });

      // ── Social proof ───────────────────────────────────────────
      gsap.from(".animate-social-part", {
        scrollTrigger: { trigger: ".social-proof-section", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
      });

      // ── About ──────────────────────────────────────────────────
      gsap.from(".animate-about-part", {
        scrollTrigger: { trigger: ".about-section", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
      });
      gsap.from(".animate-service-card", {
        scrollTrigger: { trigger: ".services-row", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.75, stagger: 0.12, ease: "power3.out",
      });

      // ── Services (New) ─────────────────────────────────────────
      gsap.from(".animate-service-header", {
        scrollTrigger: { trigger: ".services-section", start: "top 90%", toggleActions: "play none none none" },
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
      });
      gsap.from(".animate-service-item", {
        scrollTrigger: { trigger: ".animate-service-item", start: "top 92%", toggleActions: "play none none none" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
      });

      // ── Contact ────────────────────────────────────────────────
      gsap.from(".animate-contact-part", {
        scrollTrigger: { trigger: ".contact-section", start: "top 80%" },
        y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
      });

      // ── Work gallery ───────────────────────────────────────────
      gsap.from(".animate-work-part", {
        scrollTrigger: { trigger: ".work-section", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
      });

      // ── Scroll progress bar ────────────────────────────────────
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 0.3 },
      });

      // ── Hero image parallax ────────────────────────────────────
      gsap.to(".hero-img", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ".hero-col-right", start: "top top", end: "bottom top", scrub: true },
      });

      // ── Work grid stagger from alternating sides ───────────────
      gsap.from(".animate-reel:nth-child(odd)", {
        scrollTrigger: { trigger: ".work-grid", start: "top 80%" },
        x: -50, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      });
      gsap.from(".animate-reel:nth-child(even)", {
        scrollTrigger: { trigger: ".work-grid", start: "top 80%" },
        x: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      });

      // ── Stats count-up with slight scale punch ─────────────────
      gsap.from(".stat-number", {
        scrollTrigger: { trigger: ".about-section", start: "top 75%" },
        scale: 0.5, opacity: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2)",
      });

      // ── Number counters ────────────────────────────────────────
      const animateNum = (
        ref: React.RefObject<HTMLSpanElement | null>,
        end: number,
        dur = 2,
      ) => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          scrollTrigger: { trigger: ".about-section", start: "top 75%" },
          innerHTML: end,
          duration: dur,
          ease: "power2.out",
          snap: { innerHTML: 1 },
        });
      };
      animateNum(stat1Ref, 1200);
      animateNum(stat2Ref, 35);
      animateNum(stat3Ref, 99);

    }, containerRef);

    // Videos/images load asynchronously (Blob is remote), which changes page
    // height after ScrollTrigger measured its positions. Refresh so reveal
    // triggers fire correctly and don't leave sections blank.
    const refresh = () => ScrollTrigger.refresh();
    const timers = [
      setTimeout(refresh, 300),
      setTimeout(refresh, 800),
      setTimeout(refresh, 1500),
    ];
    window.addEventListener("load", refresh);

    // Safety net: if anything is still hidden after load, force it visible so
    // there is never a big empty gap where a section should be.
    const safety = setTimeout(() => {
      gsap.set(
        [
          ".animate-service-item",
          ".animate-service-header",
          ".animate-about-part",
          ".animate-work-part",
          ".animate-social-part",
          ".animate-contact-part",
          ".animate-service-card",
          ".animate-reel",
        ],
        { clearProps: "opacity,transform", opacity: 1 },
      );
      ScrollTrigger.refresh();
    }, 1800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(safety);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Real local asset videos array — mapped to the exact /public/assets folder structure
  const workItems: WorkItem[] = [
    // ── YouTube (single video only) ──
    {
      title: "YouTube Feature Edit",
      category: "YouTube",
      video: "/assets/youtube video.mp4",
      time: "Featured",
      creator: "Mohamed Lahmachi"
    },

    // ── UGC Ads (public/assets/Ugc ads) ──
    {
      title: "MSS Ad — Vid 19",
      category: "UGC Ads",
      video: "/assets/Ugc ads/MSS VID 19.mp4",
      time: "2h ago",
      creator: "My Sweety Skin"
    },
    {
      title: "MSS Ad — Video 2",
      category: "UGC Ads",
      video: "/assets/Ugc ads/MSS VIDEO 2.mp4",
      time: "5h ago",
      creator: "My Sweety Skin"
    },
    {
      title: "UGC Ad — Number 1",
      category: "UGC Ads",
      video: "/assets/Ugc ads/number 1.mp4",
      time: "1d ago",
      creator: "My Sweety Skin"
    },
    {
      title: "UGC Ad — Number 2",
      category: "UGC Ads",
      video: "/assets/Ugc ads/number 2.mp4",
      time: "2d ago",
      creator: "My Sweety Skin"
    },

    // ── Content Reels (public/assets/content reels) ──
    {
      title: "RFM Reel",
      category: "Content Reels",
      video: "/assets/content reels/RFM.mp4",
      time: "3h ago",
      creator: "Content Studio"
    },
    {
      title: "Bloc 1",
      category: "Content Reels",
      video: "/assets/content reels/bloc 1.mp4",
      time: "6h ago",
      creator: "Content Studio"
    },
    {
      title: "Darmarket 2",
      category: "Content Reels",
      video: "/assets/content reels/darmarket 2.mp4",
      time: "1d ago",
      creator: "Darmarket"
    },
    {
      title: "Content Reel — Number 1",
      category: "Content Reels",
      video: "/assets/content reels/number 1.mp4",
      time: "2d ago",
      creator: "Content Studio"
    },

    // ── Motion Design (public/assets/motion design) ──
    {
      title: "Motion Graphics 2",
      category: "Motion Design",
      video: "/assets/motion design/motion graphics 2.mp4",
      time: "4h ago",
      creator: "Motion Lab"
    },
    {
      title: "Motion Design — Number 1",
      category: "Motion Design",
      video: "/assets/motion design/number 1.mp4",
      time: "12h ago",
      creator: "Motion Lab"
    },
    {
      title: "Motion Design — Number 2",
      category: "Motion Design",
      video: "/assets/motion design/number 2.mp4",
      time: "3d ago",
      creator: "Motion Lab"
    },
    {
      title: "Motion Design — Number 3",
      category: "Motion Design",
      video: "/assets/motion design/number 3.mp4",
      time: "5d ago",
      creator: "Motion Lab"
    }
  ];

  // Filtering Logic
  const filteredItems = activeCategory === "All"
    ? workItems
    : workItems.filter(item => item.category === activeCategory);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);

  return (
    <>
      <CustomCursor />

      <div
        ref={containerRef}
        className="min-h-screen text-purple-100 font-sans selection:bg-purple-600 selection:text-white relative overflow-x-clip"
      >
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Scroll progress bar */}
        <div className="scroll-progress fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 z-[99999] origin-left scale-x-0" />

        {/* Ambient premium glowing backdrops to remove empty space vibes */}
        <div className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[25%] right-[-10%] w-[700px] h-[700px] bg-indigo-900/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-[50%] left-[-10%] w-[650px] h-[650px] bg-fuchsia-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[75%] right-[-5%] w-[700px] h-[700px] bg-purple-950/20 rounded-full blur-[170px] pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[10%] w-[600px] h-[600px] bg-violet-900/15 rounded-full blur-[150px] pointer-events-none" />

        {/* ────────────────── NAVBAR ────────────────── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled ? "nav-glass py-4" : "py-7"
          }`}
        >
          <div className="flex justify-between items-center px-6 md:px-12 max-w-[1400px] mx-auto animate-fade-up">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white font-display">Mohamed Lahmachi</span>
            </div>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-purple-300/80">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="relative group transition-colors hover:text-white">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-purple-500 group-hover:w-full transition-all duration-300 ease-out" />
                </a>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <MagneticButton
                onClick={() => scrollToId("contact")}
                className="hidden lg:block bg-purple-600 text-white px-7 py-3 rounded-full text-[15px] font-medium hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                Contact us
              </MagneticButton>
              <button
                className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-[#080414]/95 backdrop-blur-xl border-t border-purple-500/10 px-6 py-6 flex flex-col gap-3">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[17px] font-medium py-1 text-purple-200 hover:text-purple-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setMenuOpen(false); scrollToId("contact"); }}
                className="mt-3 bg-purple-600 text-white px-7 py-3.5 rounded-full text-[15px] font-medium w-full hover:bg-purple-500 transition-colors"
              >
                Contact us
              </button>
            </div>
          </div>
        </nav>

        {/* ────────────────── HERO ────────────────── */}
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-28 md:pt-36 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center relative z-10">
          {/* Left column */}
          <div className="flex flex-col justify-center animate-fade-up max-w-[600px]">
            <div className="inline-flex items-center gap-2.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-semibold text-purple-300 uppercase tracking-widest">
                Freelance Video Editor
              </span>
            </div>

            <h1 className="text-[52px] lg:text-[72px] font-extrabold tracking-tight leading-[1.05] mb-8 font-display text-white">
              Turning moments
              <br className="hidden md:block" /> into timeless{" "}
              <span className="text-gradient">edits</span>
            </h1>

            <p className="text-xl text-purple-200/60 mb-10 max-w-[480px] leading-[1.65]">
              I transform raw footage into cinematic, scroll-stopping videos
              that grow audiences and elevate brands.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-12">
              <MagneticButton
                onClick={() => scrollToId("contact")}
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-medium hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 active:scale-[0.97]"
              >
                Contact Us
              </MagneticButton>
              <button
                onClick={() => scrollToId("work")}
                className="flex items-center gap-2 font-medium text-lg text-purple-300 hover:text-white transition-colors group"
              >
                My work
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          {/* Right column: video centred well, enlarged aspect-[9/16], profile badge removed */}
          <div className="flex justify-center items-center w-full lg:pl-10">
            <div 
              onClick={() => setActiveVideoModal({
                title: "Mohamed Lahmachi — Showreel",
                category: "Showcase",
                video: "/assets/video.mp4",
                time: "Featured",
                creator: "Mohamed Lahmachi"
              })}
              className="hero-col-right relative animate-video w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] lg:max-w-[400px] xl:max-w-[440px] aspect-[9/16] rounded-[32px] overflow-hidden group shadow-[0_25px_60px_rgba(139,92,246,0.28)] border border-purple-500/20 cursor-pointer"
            >
              <video
                src={media("/assets/video.mp4")}
                autoPlay
                loop
                muted
                playsInline
                className="hero-img absolute inset-0 w-full h-full object-cover transition-transform duration-[12s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />

              {/* Play button (hover) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-600/40 backdrop-blur-md border border-purple-400/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                  <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ────────────────── MARQUEE ────────────────── */}
        <section className="marquee-section mt-16 md:mt-24 border-y border-purple-500/10 overflow-hidden animate-marquee-wrap relative z-10">
          <div className="py-5">
            <div className="marquee-track flex items-center gap-0 w-max">
              {[...Array(2)].flatMap((_, gi) =>
                [
                  { label: "YouTube",   sym: "▶" },
                  { label: "Instagram", sym: "◆" },
                  { label: "TikTok",    sym: "♪" },
                  { label: "Netflix",   sym: "N" },
                  { label: "Vimeo",     sym: "V" },
                  { label: "Twitch",    sym: "⬥" },
                  { label: "Spotify",   sym: "◉" },
                  { label: "Amazon",    sym: "∞" },
                ].map(({ label, sym }) => (
                  <div
                    key={`${gi}-${label}`}
                    className="flex items-center gap-3 text-purple-300/30 select-none px-8"
                  >
                    <span className="text-[15px] font-bold text-purple-400">{sym}</span>
                    <span className="text-[13px] font-semibold tracking-[0.22em] uppercase">
                      {label}
                    </span>
                    <span className="ml-8 text-purple-300/10 text-xl">•</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ────────────────── SOCIAL PROOF ────────────────── */}
        <section className="social-proof-section relative w-full max-w-3xl mx-auto mt-20 md:mt-28 pt-6 px-6 text-center z-10">
          <div className="animate-social-part flex justify-center items-center gap-4 mb-8">
            <div className="flex -space-x-3">
              {[4, 5, 6].map(i => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i}`}
                  className="w-9 h-9 rounded-full border-2 border-purple-950"
                  style={{ zIndex: 10 - i }}
                  alt=""
                />
              ))}
            </div>
            <span className="text-purple-200/80 text-[15px] font-medium">500+ Creators</span>
            <span className="text-purple-800">•</span>
            <div className="flex items-center gap-1.5 text-purple-200/80 text-[15px] font-medium">
              <Star className="w-[18px] h-[18px] fill-purple-400 text-purple-400" />
              <span>5/5 (440)</span>
            </div>
          </div>

          <h2 className="animate-social-part text-3xl md:text-[42px] font-bold tracking-tight mb-5 leading-[1.12] text-white font-display">
            Trusted by creators &<br />brands worldwide
          </h2>

          <p className="animate-social-part text-[17px] text-purple-200/60 mb-8 max-w-lg mx-auto leading-relaxed">
            Mohamed helps creators and brands tell their story through
            precision editing, motion & sound design.
          </p>

          <button
            onClick={() => scrollToId("work")}
            className="animate-social-part flex items-center justify-center gap-2 mx-auto font-medium text-[15px] text-purple-300 hover:text-purple-400 transition-colors group"
          >
            Browse work
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </section>

        {/* ────────────────── ABOUT + STATS ────────────────── */}
        <section id="about" className="about-section max-w-5xl mx-auto mt-24 md:mt-32 px-6 text-center relative z-10 scroll-mt-24">
          <div className="animate-about-part flex justify-center items-center gap-2.5 mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-[13px] font-semibold text-purple-300 uppercase tracking-widest">
              About me
            </span>
          </div>

          <div className="animate-about-part flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-purple-500/20 blur-2xl" />
              <img
                src="/assets/1.png"
                alt="Mohamed Lahmachi"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover object-top border-2 border-purple-500/30 shadow-[0_12px_40px_rgba(139,92,246,0.25)]"
              />
            </div>
          </div>

          <h2 className="animate-about-part text-4xl md:text-[56px] font-bold tracking-tight mb-6 text-white font-display">
            Hi, I'm Mohamed Lahmachi
          </h2>

          <p className="animate-about-part text-lg md:text-xl text-purple-200/60 mb-12 max-w-[600px] mx-auto leading-relaxed">
            A freelance video editor with 5+ years of experience crafting
            cinematic content for YouTube, Instagram, TikTok and beyond.
            I turn raw footage into stories people can't stop watching.
          </p>

          {/* Service cards */}
          <div className="services-row grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 text-left">
            {[
              {
                icon: <Zap className="w-5 h-5 text-purple-400" />,
                title: "Fast Turnaround",
                desc: "Edited videos delivered within 24–48 hours, ready to publish.",
              },
              {
                icon: <Layers className="w-5 h-5 text-purple-400" />,
                title: "Cinematic Quality",
                desc: "Color grading, transitions & sound design at a professional level.",
              },
              {
                icon: <Clock className="w-5 h-5 text-purple-400" />,
                title: "Unlimited Revisions",
                desc: "I refine until you're 100% happy — no hidden revision fees.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="animate-service-card bg-purple-950/20 border border-purple-500/10 rounded-[20px] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/25 hover:bg-purple-900/10 hover:shadow-[0_12px_40px_rgba(139,92,246,0.08)]"
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="font-bold text-[17px] mb-2 text-white font-display">{title}</h3>
                <p className="text-purple-200/60 text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 w-full max-w-4xl mx-auto md:border-t border-purple-500/10 md:pt-16">
            <div className="animate-about-part flex flex-col items-center">
              <div className="stat-number text-[64px] leading-none font-bold tracking-tight mb-3 flex items-baseline text-purple-400 font-display">
                <span ref={stat1Ref} className="tabular-nums">0</span>+
              </div>
              <div className="text-purple-200/60 text-[15px]">Projects delivered</div>
            </div>
            <div className="animate-about-part md:border-l border-purple-500/10 flex flex-col items-center">
              <div className="stat-number text-[64px] leading-none font-bold tracking-tight mb-3 flex items-baseline text-purple-400 font-display">
                <span ref={stat2Ref} className="tabular-nums">0</span>M
              </div>
              <div className="text-purple-200/60 text-[15px]">Views generated</div>
            </div>
            <div className="animate-about-part md:border-l border-purple-500/10 flex flex-col items-center">
              <div className="stat-number text-[64px] leading-none font-bold tracking-tight mb-3 flex items-baseline text-purple-400 font-display">
                <span ref={stat3Ref} className="tabular-nums">0</span>%
              </div>
              <div className="text-purple-200/60 text-[15px]">Client satisfaction</div>
            </div>
          </div>
        </section>

        {/* ────────────────── SERVICES SECTION ────────────────── */}
        <section id="services" className="services-section border-t border-purple-500/10 mt-20 md:mt-24 pt-16 md:pt-20 pb-16 relative z-10 scroll-mt-16">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 lg:gap-20 items-start">
              {/* Left: sticky header */}
              <div className="animate-service-header lg:sticky lg:top-28">
                <div className="inline-flex items-center gap-2.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-sm font-semibold text-purple-300 uppercase tracking-widest">
                    Expertise
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight mb-6 leading-[1.05] text-white font-display">
                  Services <br className="hidden sm:block" />
                  <span className="text-gradient">&amp; capabilities</span>
                </h2>
                <p className="text-base md:text-lg text-purple-200/60 max-w-[420px] leading-relaxed mb-10">
                  I offer end-to-end video production and editing services designed to hold attention, drive engagement, and convert viewers into fans.
                </p>
                <MagneticButton
                  onClick={() => scrollToId("contact")}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full font-medium hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 active:scale-[0.97]"
                >
                  Discuss a Project
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </div>

              {/* Right: service cards */}
              <div className="flex flex-col gap-5">
                {[
                  { icon: <Zap className="w-6 h-6 text-purple-300" />, title: "Short-Form Content", desc: "High-retention TikToks, Reels, and YouTube Shorts designed with viral hooks, captions, and fast-paced styling.", tags: ["TikTok", "Reels", "Shorts"] },
                  { icon: <Play className="w-6 h-6 text-purple-300" />, title: "YouTube Videos & Vlogs", desc: "Engaging long-form edits, complete with A/B testing variations, sound design, and audience retention strategies.", tags: ["Long-form", "Vlogs", "Documentaries"] },
                  { icon: <Layers className="w-6 h-6 text-purple-300" />, title: "Commercials & Brand Promos", desc: "Cinematic color grading, visual effects, and professional sound mixing for high-end campaigns.", tags: ["Color Grading", "VFX", "Sound Design"] },
                ].map((srv, idx) => (
                  <div
                    key={idx}
                    className="animate-service-item relative overflow-hidden p-6 sm:p-8 rounded-[28px] bg-purple-950/20 border border-purple-500/10 hover:bg-purple-950/40 hover:border-purple-500/30 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(139,92,246,0.12)] transition-all duration-500 group"
                  >
                    {/* Glow accent on hover */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/0 group-hover:bg-purple-600/20 rounded-full blur-3xl transition-colors duration-700 pointer-events-none" />

                    <div className="relative flex items-start gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-500">
                        {srv.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors font-display">
                            {srv.title}
                          </h3>
                          <span className="shrink-0 text-sm font-semibold text-purple-500/40 tabular-nums font-display">
                            0{idx + 1}
                          </span>
                        </div>
                        <p className="text-purple-200/60 text-[15px] leading-relaxed mb-6">{srv.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {srv.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-purple-900/40 border border-purple-500/10 rounded-full text-[13px] font-medium text-purple-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── WORK GALLERY (with dynamic local video players & category filters) ────────────────── */}
        <section id="work" className="work-section max-w-[1200px] mx-auto mt-20 md:mt-24 px-6 text-center relative z-10 scroll-mt-24">
          <div className="animate-work-part flex justify-center items-center gap-2.5 mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-[13px] font-semibold text-purple-300 uppercase tracking-widest">
              Work
            </span>
          </div>

          <h2 className="animate-work-part text-4xl md:text-[56px] font-bold tracking-tight mb-6 text-white font-display">
            Selected work
          </h2>

          <p className="animate-work-part text-lg md:text-xl text-purple-200/60 mb-10 max-w-[600px] mx-auto leading-relaxed">
            A curated selection of edits across YouTube, Instagram Reels,
            TikTok and branded content.
          </p>

          {/* Categories Bar */}
          <div className="animate-work-part flex flex-wrap justify-center gap-3 mb-12">
            {["All", "YouTube", "UGC Ads", "Content Reels", "Motion Design"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowAll(false);
                }}
                className={`px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-purple-950/40 text-purple-300 border border-purple-500/10 hover:bg-purple-900/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Reels video grid */}
          <div className="relative isolate pt-4 max-w-[1100px] mx-auto">
            <div className={`work-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-[32px] border border-purple-500/10 transition-all duration-500 ${
              showAll || filteredItems.length <= 6 ? "" : "max-h-[1080px] overflow-hidden"
            }`}>
              {displayedItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveVideoModal(item)}
                  className={`animate-reel relative w-full rounded-[24px] overflow-hidden group shadow-md cursor-pointer border border-purple-500/10 bg-purple-950/20 ${
                    item.category === "YouTube"
                      ? "aspect-video sm:col-span-2 md:col-span-3"
                      : "aspect-[9/15]"
                  }`}
                >
                  {/* Local video source player */}
                  <video
                    src={media(item.video)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                  {/* Purple tint overlay on hover */}
                  <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/15 transition-colors duration-500" />

                  {/* Header metadata */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2.5 text-white">
                      <div className="w-[34px] h-[34px] rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-purple-200">
                        {item.creator.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-[14px] font-semibold text-white truncate max-w-[140px]">
                          {item.title}
                        </span>
                        <span className="text-purple-300/80 text-[11px]">
                          {item.creator}
                        </span>
                      </div>
                    </div>
                    
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/20 text-[10px] font-medium text-purple-200 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Date marker */}
                  <div className="absolute bottom-5 left-5 text-white/60 text-[11px] font-medium tracking-wide z-10">
                    Delivered {item.time}
                  </div>

                  {/* Play icon badge */}
                  <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-purple-600/30 border border-purple-400/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Fade overlay and Show More button */}
            {filteredItems.length > 6 && !showAll && (
              <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-[#16082c] via-[#16082c]/85 to-transparent flex items-end justify-center pb-12 z-20 pointer-events-none">
                <MagneticButton
                  onClick={() => setShowAll(true)}
                  className="pointer-events-auto animate-work-part bg-purple-600 text-white px-9 py-4 rounded-full text-[15px] font-medium hover:bg-purple-500 transition-colors duration-300 shadow-[0_15px_40px_rgba(139,92,246,0.3)] flex items-center gap-3 active:scale-[0.97]"
                >
                  View More Work
                </MagneticButton>
              </div>
            )}
          </div>

          {/* Show Less button when fully expanded */}
          {showAll && filteredItems.length > 6 && (
            <div className="flex justify-center mt-8 relative z-30">
              <MagneticButton
                onClick={() => setShowAll(false)}
                className="bg-purple-950/40 text-purple-200 border border-purple-500/20 px-9 py-4 rounded-full text-[15px] font-medium hover:bg-purple-900/30 hover:border-purple-500/40 transition-colors duration-300 flex items-center gap-3"
              >
                Show Less Work
              </MagneticButton>
            </div>
          )}

          {/* Global stats summary */}
          <div className="animate-work-part flex flex-wrap justify-center items-center gap-10 md:gap-28 mt-14 mb-8">
            {[
              { icon: <Eye       className="w-7 h-7 stroke-[1.5] text-purple-400" />, val: "100M+", label: "Views"      },
              { icon: <Users     className="w-7 h-7 stroke-[1.5] text-purple-400" />, val: "250K+", label: "Followers"  },
              { icon: <TrendingUp className="w-7 h-7 stroke-[1.5] text-purple-400" />, val: "280%", label: "Engagement" },
            ].map(({ icon, val, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="text-white">{icon}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white font-display">{val}</span>
                  <span className="text-[15px] text-purple-200/60 font-medium">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ────────────────── CONTACT ────────────────── */}
        <section id="contact" className="contact-section max-w-[1400px] mx-auto mt-20 md:mt-24 mb-10 px-6 md:px-12 relative z-10 scroll-mt-24">
          <div className="bg-[#0f0a21] border border-purple-500/15 rounded-[40px] p-10 md:p-20 text-center overflow-hidden relative isolate group shadow-[0_20px_50px_rgba(139,92,246,0.1)]">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/3" />
            
            <div className="animate-contact-part flex justify-center items-center gap-2.5 mb-8 relative z-10">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-semibold text-purple-300/70 uppercase tracking-widest">
                Get in touch
              </span>
            </div>
            
            <h2 className="animate-contact-part text-4xl md:text-[72px] font-bold text-white tracking-tight mb-8 leading-[1.05] relative z-10 font-display">
              Ready to create something <br className="hidden md:block" />
              <span className="text-purple-400">extraordinary?</span>
            </h2>
            
            <p className="animate-contact-part text-lg text-purple-200/60 mb-14 max-w-[500px] mx-auto relative z-10">
              Let's elevate your content. Reach out directly via email or WhatsApp and we'll reply within 24 hours.
            </p>
            
            <div className="animate-contact-part flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10">
              <a href="mailto:Mohaamedlahmachii@gmail.com" className="w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto bg-white text-purple-950 px-10 py-4 rounded-full text-[16px] font-bold hover:bg-purple-100 transition-all duration-300 shadow-xl">
                  Email Me
                </MagneticButton>
              </a>
              <a href="https://wa.me/212675639152" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto bg-[#25D366] text-white px-10 py-4 rounded-full text-[16px] font-semibold hover:bg-[#20bd5a] transition-colors shadow-xl shadow-[#25D366]/20 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  WhatsApp
                </MagneticButton>
              </a>
            </div>
          </div>
        </section>

        {/* ────────────────── FOOTER ────────────────── */}
        <footer className="max-w-[1400px] mx-auto px-6 md:px-12 py-14 mt-4 border-t border-purple-500/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white font-display">Mohamed Lahmachi</span>
          </div>
          <p className="text-sm text-purple-300/40">© 2026 Mohamed Lahmachi. All rights reserved.</p>
          <div className="flex items-center gap-8 text-sm text-purple-300/60">
            {["Privacy", "Terms", "Contact"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
        </footer>

        {/* Video Modal Lightbox */}
        {activeVideoModal && (
          <div 
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setActiveVideoModal(null)}
          >
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 cursor-pointer hover:rotate-90"
              onClick={(e) => {
                e.stopPropagation();
                setActiveVideoModal(null);
              }}
              aria-label="Close video player"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div 
              className="relative max-w-4xl w-full flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[72vh] rounded-2xl overflow-hidden border border-purple-500/35 shadow-[0_0_50px_rgba(168,85,247,0.25)] bg-black flex items-center justify-center">
                <video
                  src={media(activeVideoModal.video)}
                  autoPlay
                  controls
                  playsInline
                  className="max-h-[72vh] max-w-full object-contain"
                />
              </div>

              {/* Video metadata description */}
              <div className="text-center w-full max-w-[400px] bg-purple-950/50 backdrop-blur-md border border-purple-500/15 rounded-2xl p-4 shadow-xl">
                <h3 className="text-lg font-bold text-white font-display leading-tight">{activeVideoModal.title}</h3>
                <p className="text-purple-300 text-sm mt-1">{activeVideoModal.creator} • {activeVideoModal.category}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
