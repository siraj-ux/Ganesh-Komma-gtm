import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { useFacebookPixel } from "@/hooks/usePIxelWatch";

const PROGRAM_CODE = "A1_Eng_ADX_OTO_GA";
const WEBINAR_SYNC_URL = `https://webinarsync.gdworkflows.in/sync-webinar?programCode=${encodeURIComponent(
  PROGRAM_CODE
)}`;

const ThankuFreeFb = () => {
  useFacebookPixel();
  const [waLink, setWaLink] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchWaLink() {
      try {
        const res = await fetch(WEBINAR_SYNC_URL);
        const json = await res.json();

        const link = json?.data?.wAGroupJoiningLink || "";

        if (!ignore) {
          setWaLink(link);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setWaLink("");
          setLoading(false);
        }
      }
    }

    fetchWaLink();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#FFF3E1] overflow-hidden">
      {/* soft background glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2E4C8C]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-[#FA2D1A]/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 max-w-xl w-full mx-4 rounded-3xl border border-[#2E4C8C]/15 bg-white/80 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#2E4C8C] px-6 py-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="mt-3 text-xl md:text-2xl font-extrabold text-white">
            Registration Successful
          </h1>
          <p className="mt-1 text-sm text-white/85">
            You’re all set. Please join WhatsApp for further updates.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 text-center">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#FA2D1A]/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#FA2D1A]" />
            </div>

            <p className="text-sm text-[#1A1F2B]">
              All important updates, reminders, and access links will be shared on WhatsApp.
            </p>

            <p className="text-xs text-[#3B3F4A]">
              Please make sure to join the WhatsApp group to stay informed.
            </p>
          </div>

          {/* CTA */}
          <a
            href={waLink || "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!waLink}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md transition active:scale-[0.99] ${
              !waLink ? "opacity-60 pointer-events-none" : "hover:shadow-lg"
            }`}
            style={{ backgroundColor: "#00c614" }}
          >
            {loading ? "Loading WhatsApp Link..." : "Join WhatsApp Group"}
            <ArrowRight className="w-5 h-5" />
          </a>

          {!loading && !waLink ? (
            <p className="mt-4 text-xs text-[#FA2D1A]">
              WhatsApp link not available right now. Please refresh this page in a moment.
            </p>
          ) : (
            <p className="mt-4 text-xs text-[#3B3F4A]">
              If the button doesn’t open, please check WhatsApp is installed on your device.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default ThankuFreeFb;
