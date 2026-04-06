import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import {
  Play,
  AlertTriangle,
  TrendingUp,
  Shield,
  ArrowRight,
  CalendarDays,
  Clock,
  Languages,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";

// GTM & Product Imports
import AddToCartButton from '@/components/AddToCartButton';
import { trackAddToCart } from "@/utils/gtm";
import { PRODUCT } from "@/utils/product-info";
import SubscribeButton from "@/components/SubscribeButton";

const FORM_ID = "webinar-lead-form";
const YOUTUBE_ID = "eNUfnbzLr7M";

const PABBLY_WEBHOOK_URL =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZmMDYzNjA0MzE1MjY4NTUzNDUxMzIi_pc";

const PAGE_NAME = "A1_Eng_ADX_OTO_FB";

// ✅ Webinar sync endpoint (for date/day/time)
const WEBINAR_SYNC_URL = `https://webinarsync.gdworkflows.in/sync-webinar?programCode=${encodeURIComponent(
  PAGE_NAME
)}`;

const floatingBadges = [
  {
    icon: TrendingUp,
    label: "Smart Investing",
    chipBg: "bg-white/80",
    iconBg: "bg-[#FA2D1A]",
  },
  {
    icon: Shield,
    label: "Risk Management",
    chipBg: "bg-white/80",
    iconBg: "bg-[#2E4C8C]",
  },
];

const stats = [
  { number: "15+", label: "Years Experience" },
  { number: "1.2L+", label: "Students Trained" },
  { number: "98%", label: "Success Rate" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function scrollToWebinarForm() {
  const wrappers = document.querySelectorAll(".webinar-form-wrapper");
  for (let i = 0; i < wrappers.length; i++) {
    const w = wrappers[i];
    if (w.getBoundingClientRect().width > 0) {
      w.scrollIntoView({ behavior: "smooth", block: "start" });
      break;
    }
  }
}

function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function getTrackingFromUrl() {
  const p = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
  ];
  const track: Record<string, string> = {};
  keys.forEach((k) => (track[k] = p.get(k) || ""));
  return track;
}

type WebinarMeta = {
  date: string;
  day: string;
  time: string;
  language?: string;
};

const HeroForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    profession: "",
    objective: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    city: false,
    profession: false,
    objective: false,
  });

  // ⏱️ 5 min timer
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const errors = useMemo(() => {
    const name =
      form.name.trim().length < 2 ? "Please enter your full name." : "";
    const email = !EMAIL_RE.test(form.email.trim())
      ? "Please enter a valid email."
      : "";
    const phoneDigits = form.phone.replace(/\D/g, "");
    const phone =
      phoneDigits.length !== 10
        ? "Please enter a valid phone number (10 digits)."
        : "";
    const city = form.city.trim().length < 2 ? "Please enter your city." : "";
    const profession = !form.profession ? "Please select your profession." : "";
    const objective = !form.objective ? "Please select your objective." : "";
    return { name, email, phone, city, profession, objective };
  }, [form]);

  const isValid = useMemo(
    () =>
      !errors.name &&
      !errors.email &&
      !errors.phone &&
      !errors.city &&
      !errors.profession &&
      !errors.objective,
    [errors]
  );

  const setField = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const markTouched = (key: keyof typeof touched) => {
    setTouched((p) => ({ ...p, [key]: true }));
  };

  const showError = (key: keyof typeof errors) => touched[key] && !!errors[key];

  // ✅ CORS-safe: send as "simple request" (no JSON header) + no credentials
  async function sendToPabbly(payload: Record<string, any>) {
    // 1) sendBeacon first (best on redirect)
    try {
      const blob = new Blob([JSON.stringify(payload)], { type: "text/plain" });
      const ok = navigator.sendBeacon?.(PABBLY_WEBHOOK_URL, blob);
      if (ok) return;
    } catch { }

    // 2) fallback fetch: x-www-form-urlencoded (no preflight)
    try {
      const body = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) =>
        body.append(k, String(v ?? ""))
      );

      await fetch(PABBLY_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body,
        credentials: "omit",
        keepalive: true,
      });
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({
      name: true,
      email: true,
      phone: true,
      city: true,
      profession: true,
      objective: true,
    });

    if (!isValid) return;

    setIsSubmitting(true);

    // Note: trackAddToCart(PRODUCT) is handled internally by AddToCartButton component 
    // to prevent double-triggering events.

    const track = getTrackingFromUrl();
    const weburl = window.location.href;
    const page_name = PAGE_NAME;

    // 🔥 TRACK LEAD EVENT (On successful validation)
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: page_name,
        // Advanced matching data
        em: form.email.toLowerCase().trim(),
        ph: form.phone.replace(/\D/g, ""),
        ct: form.city,
      });
    }

    // ✅ store backup
    try {
      localStorage.setItem("lead_data", JSON.stringify(form));
      localStorage.setItem("lead_utms", JSON.stringify(track));
    } catch { }

    // ✅ Send to Pabbly
    const pabblyPayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      profession: form.profession,
      objective: form.objective,
      ...track,
      fbclid: track.fbclid || "",
      page_name,
      weburl,
    };

    void sendToPabbly(pabblyPayload);

    // ✅ Pass via query params and redirect
    const params = new URLSearchParams({
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      profession: form.profession,
      objective: form.objective,
      page_name,
      weburl,
      ...track,
    }).toString();

    window.location.href = `/tyfb?${params}`;
  }

  return (
    <div
      id={FORM_ID}
      className="webinar-form-wrapper rounded-2xl border border-[#2E4C8C]/15 bg-white/60 shadow-xl overflow-hidden relative z-10"
    >
      <div className="p-5">
        <div className="mb-4 text-center">
          <span
            className="inline-flex items-center rounded-full border border-[#2E4C8C]/15 bg-white/70 px-3 py-1 text-xs font-semibold"
            style={{ color: "#2E4C8C" }}
          >
            Quick Registration
          </span>

          <h3
            className="mt-2 text-lg md:text-xl font-extrabold"
            style={{ color: "#2E4C8C" }}
          >
            Get Instant Access
          </h3>

          {/* ⏱️ Countdown Timer */}
          <div className="mb-3 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FA2D1A]/10 border border-[#FA2D1A]/30 px-4 py-1.5">
              <span className="text-xs font-semibold text-[#FA2D1A]">
                Offer Expires In
              </span>
              <span className="font-mono text-sm font-bold text-[#FA2D1A]">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </div>
          </div>

          <p className="text-xs mt-1" style={{ color: "#3B3F4A" }}>
            Fill details to join + unlock bonuses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>
              Full Name
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm focus-within:shadow-md transition ${showError("name") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                }`}
            >
              <User
                className="w-4 h-4"
                style={{ color: showError("name") ? "#FA2D1A" : "#2E4C8C" }}
              />
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => markTouched("name")}
                placeholder="Enter your name"
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: "#1A1F2B" }}
                autoComplete="name"
              />
            </div>
            {showError("name") ? (
              <p className="text-[11px]" style={{ color: "#FA2D1A" }}>
                {errors.name}
              </p>
            ) : null}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>
              Email
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm focus-within:shadow-md transition ${showError("email") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                }`}
            >
              <Mail
                className="w-4 h-4"
                style={{ color: showError("email") ? "#FA2D1A" : "#2E4C8C" }}
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => markTouched("email")}
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: "#1A1F2B" }}
                autoComplete="email"
              />
            </div>
            {showError("email") ? (
              <p className="text-[11px]" style={{ color: "#FA2D1A" }}>
                {errors.email}
              </p>
            ) : null}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>
              Phone Number
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm focus-within:shadow-md transition ${showError("phone") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                }`}
            >
              <Phone
                className="w-4 h-4"
                style={{ color: showError("phone") ? "#FA2D1A" : "#2E4C8C" }}
              />
              <input
                inputMode="tel"
                value={form.phone}
                onChange={(e) => {
                  const safe = e.target.value.replace(/[^\d+\-\s()]/g, "");
                  setField("phone", safe);
                }}
                onBlur={() => markTouched("phone")}
                placeholder="Enter phone (10 digits)"
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: "#1A1F2B" }}
                autoComplete="tel"
              />
            </div>
            {showError("phone") ? (
              <p className="text-[11px]" style={{ color: "#FA2D1A" }}>
                {errors.phone}
              </p>
            ) : null}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>
              City
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm focus-within:shadow-md transition ${showError("city") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                }`}
            >
              <MapPin
                className="w-4 h-4"
                style={{ color: showError("city") ? "#FA2D1A" : "#2E4C8C" }}
              />
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                onBlur={() => markTouched("city")}
                placeholder="Enter your city"
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: "#1A1F2B" }}
                autoComplete="address-level2"
              />
            </div>
            {showError("city") ? (
              <p className="text-[11px]" style={{ color: "#FA2D1A" }}>
                {errors.city}
              </p>
            ) : null}
          </div>

          {/* Profession */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>
              Profession
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm focus-within:shadow-md transition ${showError("profession")
                ? "border-[#FA2D1A]/60"
                : "border-[#2E4C8C]/15"
                }`}
            >
              <select
                value={form.profession}
                onChange={(e) => setField("profession", e.target.value)}
                onBlur={() => markTouched("profession")}
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: form.profession ? "#1A1F2B" : "#6B7280" }}
              >
                <option value="" disabled>
                  Select Profession
                </option>
                <option value="Working Professional">Working Professional</option>
                <option value="Business Owner / Entrepreneur">
                  Business Owner / Entrepreneur
                </option>
                <option value="Student">Student</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {showError("profession") ? (
              <p className="text-[11px]" style={{ color: "#FA2D1A" }}>
                {errors.profession}
              </p>
            ) : null}
          </div>

          {/* Objective */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>
              Objective
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm focus-within:shadow-md transition ${showError("objective")
                ? "border-[#FA2D1A]/60"
                : "border-[#2E4C8C]/15"
                }`}
            >
              <select
                value={form.objective}
                onChange={(e) => setField("objective", e.target.value)}
                onBlur={() => markTouched("objective")}
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: form.objective ? "#1A1F2B" : "#6B7280" }}
              >
                <option value="" disabled>
                  Select Objective
                </option>
                <option value="Just exploring">Just exploring</option>
                <option value="Immediate results (ready to start now)">
                  Immediate results (ready to start now)
                </option>
                <option value="willing to invest time & capital to learn">
                  willing to invest time &amp; capital to learn.
                </option>
              </select>
            </div>
            {showError("objective") ? (
              <p className="text-[11px]" style={{ color: "#FA2D1A" }}>
                {errors.objective}
              </p>
            ) : null}
          </div>

          <AddToCartButton
            type="submit"
            product={PRODUCT}
            disabled={isSubmitting}
            className="!bg-[#FA2D1A] w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg transition active:scale-[0.99]"
            style={{ backgroundColor: "#FA2D1A" }}
            label={
              isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" /> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Register Now & Get Access
                  <ArrowRight className="w-5 h-5" />
                </span>
              )
            }
          />

          <p className="text-[11px] text-center" style={{ color: "#3B3F4A" }}>
            Receive bonuses by joining the WhatsApp group.{" "}
            <span className="font-bold" style={{ color: "#FA2D1A" }}>
              Only 4 Seats Left!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

const HeroSectionFb = () => {
  const [play, setPlay] = useState(false);

  // ✅ Webinar meta fetched from sync endpoint
  const [webinarMeta, setWebinarMeta] = useState<WebinarMeta>({
    date: "Loading...",
    day: "Loading...",
    time: "Loading...",
    language: "English",
  });

  useEffect(() => {
    let ignore = false;

    async function fetchMeta() {
      try {
        const res = await fetch(WEBINAR_SYNC_URL, { method: "GET" });
        const json = await res.json();

        // expected shape: { success: true, data: { date, day, time, ... } }
        const d = json?.data || {};
        const next: WebinarMeta = {
          date: d?.date || "—",
          day: d?.day || "—",
          time: d?.time || "—",
          language: "English",
        };

        if (!ignore) setWebinarMeta(next);
      } catch {
        if (!ignore) {
          setWebinarMeta({
            date: "—",
            day: "—",
            time: "—",
            language: "English",
          });
        }
      }
    }

    fetchMeta();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Attention Bar */}
      <div className="bg-[#2E4C8C] py-2 px-3">
        <div className="container-main flex items-center justify-center gap-2 text-center">
          <AlertTriangle className="w-4 h-4 text-white/90 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-white">
            <span className="font-bold">Attention:</span>{" "}
            Working Professionals, Retirees, Business Owners, And Stock Market Enthusiasts!{" "}
            <span className="italic opacity-80">(Not for Students)</span>
          </p>
        </div>
      </div>

      <div className="relative" style={{ backgroundColor: "#FFF3E1" }}>
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2E4C8C]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-[#FA2D1A]/10 blur-3xl" />

        <div className="container-main relative z-10 py-8 md:py-10 lg:py-12">
          {/* ===================== MOBILE STACK ===================== */}
          <div className="flex flex-col gap-6 lg:hidden">
            <div className="flex justify-center">
              <span className="inline-flex items-center rounded-full border border-[#2E4C8C]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#2E4C8C]">
                From Confusion to Confidence
              </span>
            </div>

            <h1
              className="text-3xl font-bold leading-tight text-center"
              style={{ color: "#2E4C8C" }}
            >
              Unlock <span className="text-[#FA2D1A]">Proven Strategies</span> To Invest In Stock Market
            </h1>

            <p className="text-sm text-center" style={{ color: "#1A1F2B" }}>
              Master <span className="font-semibold">simple strategies</span> to make{" "}
              <span className="font-semibold">smarter investment decisions</span> without the stress
            </p>

            <div className="flex justify-center">
              <div
                className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold"
                style={{ color: "#1A1F2B" }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                  <CalendarDays className="w-4 h-4 text-[#2E4C8C]" />
                  Date: {webinarMeta.date} ({webinarMeta.day})
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                  <Clock className="w-4 h-4 text-[#2E4C8C]" />
                  Time: {webinarMeta.time}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                  <Languages className="w-4 h-4 text-[#2E4C8C]" />
                  Lang: {webinarMeta.language || "English"}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <SubscribeButton
                onClick={scrollToWebinarForm}
                ctaLocation="hero_mobile"
                className="bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
                style={{ backgroundColor: "#FA2D1A" }}
                label={
                  <span className="flex items-center gap-2">
                    Register Now & Get Access
                    <ArrowRight className="w-5 h-5" />
                  </span>
                }
              />
            </div>

            {/* VIDEO PREVIEW (mobile) */}
            <div className="relative">
              {!play ? (
                <button
                  type="button"
                  onClick={() => setPlay(true)}
                  className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2E4C8C]/15 shadow-xl bg-white/60 relative group"
                  aria-label="Play webinar video"
                >
                  <img
                    src={ytThumb(YOUTUBE_ID)}
                    alt="Webinar preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-[#FA2D1A] ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-[#2E4C8C] text-white text-xs px-3 py-1">
                    2 Hour Webinar Preview
                  </div>
                </button>
              ) : (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-[#2E4C8C]/15 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
                    title="Webinar video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            <HeroForm />

            <ul className="space-y-2">
              {[
                { highlight: "consistent returns", text: "Build", suffix: "with smart strategies" },
                { highlight: "reliable income", text: "Create a", suffix: "from investments" },
                { highlight: "maximize your gains.", text: "Minimize risk,", suffix: "" },
                { highlight: "grow your investments.", text: "Confidently", suffix: "" },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FA2D1A] flex-shrink-0 mt-0.5" />
                  <span className="text-sm" style={{ color: "#1A1F2B" }}>
                    {item.text}{" "}
                    <span className="font-bold text-[#2E4C8C]">{item.highlight}</span> {item.suffix}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ===================== DESKTOP GRID ===================== */}
          <div className="hidden lg:grid grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div>
              <span className="inline-flex items-center rounded-full border border-[#2E4C8C]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#2E4C8C] mb-4">
                From Confusion to Confidence
              </span>

              <h1 className="text-[42px] leading-tight font-bold mb-4" style={{ color: "#2E4C8C" }}>
                Unlock <span className="text-[#FA2D1A]">Proven Strategies</span> To Invest In Stock Market
              </h1>

              <p className="text-base mb-5 max-w-xl" style={{ color: "#1A1F2B" }}>
                Master <span className="font-semibold">simple strategies</span> to make{" "}
                <span className="font-semibold">smarter investment decisions</span> without the stress
              </p>

              <div
                className="flex flex-wrap items-center gap-2 text-sm font-semibold mb-6"
                style={{ color: "#1A1F2B" }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                  <CalendarDays className="w-4 h-4 text-[#2E4C8C]" />
                  Date: {webinarMeta.date} ({webinarMeta.day})
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                  <Clock className="w-4 h-4 text-[#2E4C8C]" />
                  Time: {webinarMeta.time}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                  <Languages className="w-4 h-4 text-[#2E4C8C]" />
                  Lang: {webinarMeta.language || "English"}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {[
                  { highlight: "consistent returns", text: "Build", suffix: "with smart strategies" },
                  { highlight: "reliable income", text: "Create a", suffix: "from investments" },
                  { highlight: "maximize your gains.", text: "Minimize risk,", suffix: "" },
                  { highlight: "grow your investments.", text: "Confidently", suffix: "" },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FA2D1A] flex-shrink-0 mt-0.5" />
                    <span style={{ color: "#1A1F2B" }}>
                      {item.text} <span className="font-bold text-[#2E4C8C]">{item.highlight}</span>{" "}
                      {item.suffix}
                    </span>
                  </li>
                ))}
              </ul>

              <SubscribeButton
                onClick={scrollToWebinarForm}
                ctaLocation="hero_desktop"
                className="bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg transition active:scale-[0.99]"
                style={{ backgroundColor: "#FA2D1A" }}
                label={
                  <span className="flex items-center gap-2">
                    Register Now & Get Access
                    <ArrowRight className="w-5 h-5" />
                  </span>
                }
              />


              <p className="mt-3 text-sm" style={{ color: "#3B3F4A" }}>
                Receive bonuses by joining the WhatsApp group.{" "}
                <span className="font-bold text-[#FA2D1A]">Only 4 Seats Left!</span>
              </p>

              {/* stats */}
              <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#2E4C8C]/15 bg-white/60 px-3 py-3 text-center"
                  >
                    <p className="text-lg font-extrabold" style={{ color: "#2E4C8C" }}>
                      {stat.number}
                    </p>
                    <p className="text-xs" style={{ color: "#3B3F4A" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative space-y-6"
            >
              {floatingBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.35 + index * 0.12 }}
                  className={`absolute z-20 hidden md:flex items-center gap-2 rounded-full px-3 py-2 border border-[#2E4C8C]/15 backdrop-blur-sm shadow-sm ${badge.chipBg} ${index === 0 ? "top-3 right-2" : "top-1/3 -left-6"
                    }`}
                  style={{
                    animation: "floaty 4.5s ease-in-out infinite",
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  <div className={`w-8 h-8 rounded-full ${badge.iconBg} flex items-center justify-center`}>
                    <badge.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#1A1F2B" }}>
                    {badge.label}
                  </span>
                </motion.div>
              ))}

              {/* video preview */}
              {!play ? (
                <button
                  type="button"
                  onClick={() => setPlay(true)}
                  className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2E4C8C]/15 shadow-xl bg-white/60 relative group"
                  aria-label="Play webinar video"
                >
                  <img
                    src={ytThumb(YOUTUBE_ID)}
                    alt="Webinar preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-[#FA2D1A] ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-[#2E4C8C] text-white text-xs px-3 py-1">
                    2 Hour Webinar Preview
                  </div>
                </button>
              ) : (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-[#2E4C8C]/15 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
                    title="Webinar video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              )}

              <HeroForm />
            </motion.div>
          </div>
        </div>

        <style>{`
          @keyframes floaty {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default HeroSectionFb;