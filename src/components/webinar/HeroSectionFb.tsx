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

// ✅ NEW GOOGLE SHEET URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzzZC_LXxQ9AOVnr6x1jKpOlwsN-iRKS5FSN6K1yB0DppkZYT6GXxmKuDlY2BqH-W4J/exec";

// ✅ Webinar sync endpoint
const WEBINAR_SYNC_URL = `https://webinarsync.gdworkflows.in/sync-webinar?programCode=${encodeURIComponent(
  PAGE_NAME
)}`;

const floatingBadges = [
  { icon: TrendingUp, label: "Smart Investing", chipBg: "bg-white/80", iconBg: "bg-[#FA2D1A]" },
  { icon: Shield, label: "Risk Management", chipBg: "bg-white/80", iconBg: "bg-[#2E4C8C]" },
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
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"];
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
    name: false, email: false, phone: false, city: false, profession: false, objective: false,
  });

  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const errors = useMemo(() => {
    const name = form.name.trim().length < 2 ? "Please enter your full name." : "";
    const email = !EMAIL_RE.test(form.email.trim()) ? "Please enter a valid email." : "";
    const phoneDigits = form.phone.replace(/\D/g, "");
    const phone = phoneDigits.length !== 10 ? "Please enter a valid phone number (10 digits)." : "";
    const city = form.city.trim().length < 2 ? "Please enter your city." : "";
    const profession = !form.profession ? "Please select your profession." : "";
    const objective = !form.objective ? "Please select your objective." : "";
    return { name, email, phone, city, profession, objective };
  }, [form]);

  const isValid = useMemo(() => !Object.values(errors).some(err => err !== ""), [errors]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const markTouched = (key: keyof typeof touched) => {
    setTouched((p) => ({ ...p, [key]: true }));
  };

  const showError = (key: keyof typeof errors) => touched[key] && !!errors[key];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({ name: true, email: true, phone: true, city: true, profession: true, objective: true });

    if (!isValid) return;

    setIsSubmitting(true);

    const track = getTrackingFromUrl();
    const weburl = window.location.href;
    const page_name = PAGE_NAME;

    // 🔥 FB TRACKING
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: page_name,
        em: form.email.toLowerCase().trim(),
        ph: form.phone.replace(/\D/g, ""),
        ct: form.city,
      });
    }

    // ✅ PABBLY PAYLOAD (Logic preserved from original)
    const pabblyPayload = {
      ...form,
      ...track,
      utm_source: track.utm_source || "fb", 
      fbclid: track.fbclid || "",
      page_name,
      weburl,
    };

    // ✅ NEW GOOGLE SHEET PAYLOAD (Structure updated to match your new requirement)
    const sheetPayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      profession: form.profession,
      objective: form.objective,
      utm_source: track.utm_source || "fb",
      page_url: weburl,
      workshop_name: page_name,
      utm_medium: track.utm_medium || "",
      utm_campaign: track.utm_campaign || "",
      utm_term: track.utm_term || "",
      utm_content: track.utm_content || "",
      gclid: track.gclid || "",
      fbclid: track.fbclid || ""
    };

    try {
      await Promise.all([
        // Send to Pabbly
        fetch(PABBLY_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(pabblyPayload),
        }),
        // Send to Google Sheet
        fetch(GOOGLE_SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(sheetPayload),
        })
      ]);
    } catch (e) {
      console.error("Submission error", e);
    }

    const params = new URLSearchParams(pabblyPayload).toString();
    window.location.href = `/tyfb?${params}`;
  }

  return (
    <div id={FORM_ID} className="webinar-form-wrapper rounded-2xl border border-[#2E4C8C]/15 bg-white/60 shadow-xl overflow-hidden relative z-10">
      <div className="p-5">
        <div className="mb-4 text-center">
          <span className="inline-flex items-center rounded-full border border-[#2E4C8C]/15 bg-white/70 px-3 py-1 text-xs font-semibold" style={{ color: "#2E4C8C" }}>
            Quick Registration
          </span>
          <h3 className="mt-2 text-lg md:text-xl font-extrabold" style={{ color: "#2E4C8C" }}>
            Get Instant Access
          </h3>
          <div className="mb-3 flex justify-center">
            {/* <div className="inline-flex items-center gap-2 rounded-full bg-[#FA2D1A]/10 border border-[#FA2D1A]/30 px-4 py-1.5">
              <span className="text-xs font-semibold text-[#FA2D1A]">Offer Expires In</span>
              <span className="font-mono text-sm font-bold text-[#FA2D1A]">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div> */}
          </div>
          <p className="text-xs mt-1" style={{ color: "#3B3F4A" }}>
            Fill details to join + unlock bonuses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>Full Name</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm transition ${showError("name") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"}`}>
              <User className="w-4 h-4" style={{ color: showError("name") ? "#FA2D1A" : "#2E4C8C" }} />
              <input value={form.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => markTouched("name")} placeholder="Enter your name" className="w-full bg-transparent outline-none text-sm" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>Email</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm transition ${showError("email") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"}`}>
              <Mail className="w-4 h-4" style={{ color: showError("email") ? "#FA2D1A" : "#2E4C8C" }} />
              <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => markTouched("email")} placeholder="Enter your email" className="w-full bg-transparent outline-none text-sm" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>Phone Number</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm transition ${showError("phone") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"}`}>
              <Phone className="w-4 h-4" style={{ color: showError("phone") ? "#FA2D1A" : "#2E4C8C" }} />
              <input inputMode="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value.replace(/[^\d+\-\s()]/g, ""))} onBlur={() => markTouched("phone")} placeholder="Enter phone (10 digits)" className="w-full bg-transparent outline-none text-sm" />
            </div>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>City</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm transition ${showError("city") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"}`}>
              <MapPin className="w-4 h-4" style={{ color: showError("city") ? "#FA2D1A" : "#2E4C8C" }} />
              <input value={form.city} onChange={(e) => setField("city", e.target.value)} onBlur={() => markTouched("city")} placeholder="Enter your city" className="w-full bg-transparent outline-none text-sm" />
            </div>
          </div>

          {/* Profession */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>Profession</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm transition ${showError("profession") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"}`}>
              <select value={form.profession} onChange={(e) => setField("profession", e.target.value)} onBlur={() => markTouched("profession")} className="w-full bg-transparent outline-none text-sm">
                <option value="" disabled>Select Profession</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                <option value="Student">Student</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#2E4C8C" }}>Objective</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2.5 shadow-sm transition ${showError("objective") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"}`}>
              <select value={form.objective} onChange={(e) => setField("objective", e.target.value)} onBlur={() => markTouched("objective")} className="w-full bg-transparent outline-none text-sm">
                <option value="" disabled>Select Objective</option>
                <option value="Just exploring">Just exploring</option>
                <option value="Immediate results (ready to start now)">Immediate results (ready to start now)</option>
                <option value="willing to invest time & capital to learn">willing to invest time &amp; capital to learn.</option>
              </select>
            </div>
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
            <span className="font-bold" style={{ color: "#FA2D1A" }}>Only 4 Seats Left!</span>
          </p>
        </form>
      </div>
    </div>
  );
};

const HeroSectionFb = () => {
  const [play, setPlay] = useState(false);
  const [webinarMeta, setWebinarMeta] = useState<WebinarMeta>({
    date: "Loading...",
    day: "Loading...",
    time: "Loading...",
    language: "English",
  });

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch(WEBINAR_SYNC_URL);
        const json = await res.json();
        const d = json?.data || {};
        setWebinarMeta({
          date: d?.date || "—",
          day: d?.day || "—",
          time: d?.time || "—",
          language: "English",
        });
      } catch {
        setWebinarMeta({ date: "—", day: "—", time: "—", language: "English" });
      }
    }
    fetchMeta();
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="bg-[#2E4C8C] py-2 px-3">
        <div className="container-main flex items-center justify-center gap-2 text-center">
          <AlertTriangle className="w-4 h-4 text-white/90 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-white">
            <span className="font-bold">Attention:</span> Working Professionals, Retirees, Business Owners, And Stock Market Enthusiasts! <span className="italic opacity-80">(Not for Students)</span>
          </p>
        </div>
      </div>

      <div className="relative" style={{ backgroundColor: "#FFF3E1" }}>
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2E4C8C]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-[#FA2D1A]/10 blur-3xl" />

        <div className="container-main relative z-10 py-8 md:py-10 lg:py-12">
          {/* MOBILE VIEW */}
          <div className="flex flex-col gap-6 lg:hidden">
            <div className="text-center space-y-4">
              <span className="inline-flex items-center rounded-full border border-[#2E4C8C]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#2E4C8C]">From Confusion to Confidence</span>
              <h1 className="text-3xl font-bold leading-tight text-[#2E4C8C]">Unlock <span className="text-[#FA2D1A]">Proven Strategies</span> To Invest In Stock Market</h1>
              <p className="text-sm text-[#1A1F2B]">Master <span className="font-semibold">simple strategies</span> to make <span className="font-semibold">smarter investment decisions</span> without the stress</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold text-[#1A1F2B]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                <CalendarDays className="w-4 h-4 text-[#2E4C8C]" /> {webinarMeta.date} ({webinarMeta.day})
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1">
                <Clock className="w-4 h-4 text-[#2E4C8C]" /> {webinarMeta.time}
              </span>
            </div>

            <div className="flex justify-center">
              <SubscribeButton
                onClick={scrollToWebinarForm}
                ctaLocation="hero_mobile"
                className="bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
                label={<span className="flex items-center gap-2">Register Now & Get Access <ArrowRight className="w-5 h-5" /></span>}
              />
            </div>

            <div className="relative">
              {!play ? (
                <button type="button" onClick={() => setPlay(true)} className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2E4C8C]/15 shadow-xl bg-white/60 relative group">
                  <img src={ytThumb(YOUTUBE_ID)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"><Play className="w-7 h-7 text-[#FA2D1A] ml-0.5" fill="currentColor" /></div>
                  </div>
                </button>
              ) : (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-[#2E4C8C]/15 bg-black">
                  <iframe src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`} title="Video" frameBorder="0" allowFullScreen className="w-full h-full" />
                </div>
              )}
            </div>

            <HeroForm />
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden lg:grid grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#2E4C8C]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#2E4C8C] mb-4">From Confusion to Confidence</span>
              <h1 className="text-[42px] leading-tight font-bold mb-4" style={{ color: "#2E4C8C" }}>Unlock <span className="text-[#FA2D1A]">Proven Strategies</span> To Invest In Stock Market</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold mb-6 text-[#1A1F2B]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1"><CalendarDays className="w-4 h-4 text-[#2E4C8C]" /> Date: {webinarMeta.date} ({webinarMeta.day})</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-3 py-1"><Clock className="w-4 h-4 text-[#2E4C8C]" /> Time: {webinarMeta.time}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {["Build consistent returns", "Create reliable income", "Minimize risk", "Grow investments"].map((txt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FA2D1A] flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-[#1A1F2B]">{txt}</span>
                  </li>
                ))}
              </ul>
              <SubscribeButton
                onClick={scrollToWebinarForm}
                ctaLocation="hero_desktop"
                className="bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md"
                label={<span className="flex items-center gap-2">Register Now & Get Access <ArrowRight className="w-5 h-5" /></span>}
              />
              <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
                {stats.map((stat, i) => (
                  <div key={i} className="rounded-xl border border-[#2E4C8C]/15 bg-white/60 px-3 py-3 text-center">
                    <p className="text-lg font-extrabold text-[#2E4C8C]">{stat.number}</p>
                    <p className="text-xs text-[#3B3F4A]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative space-y-6">
               {!play ? (
                <button type="button" onClick={() => setPlay(true)} className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2E4C8C]/15 shadow-xl bg-white/60 relative group">
                  <img src={ytThumb(YOUTUBE_ID)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"><Play className="w-7 h-7 text-[#FA2D1A] ml-0.5" fill="currentColor" /></div>
                  </div>
                </button>
              ) : (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-[#2E4C8C]/15 bg-black">
                  <iframe src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`} title="Video" frameBorder="0" allowFullScreen className="w-full h-full" />
                </div>
              )}
              <HeroForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionFb;