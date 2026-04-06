import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Gift, Clock } from "lucide-react";
import { scrollToWebinarForm } from "@/components/webinar/HeroSection";
import SubscribeButton from "@/components/SubscribeButton";

const StickyFooter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > 500);
    });

    return () => unsubscribe();
  }, [scrollY]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
      style={{ backgroundColor: "#2E4C8C" }}
    >
      <div className="container-main py-2.5 md:py-3">
        {/* ---------------- MOBILE ---------------- */}
        <div className="flex flex-col gap-2 md:hidden">
          {/* Row 1 */}
          <div className="flex items-center justify-between gap-3">
            {/* Bonuses */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/15">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-xs truncate">
                  Free bonuses worth ₹9,999/-
                </p>
                <p className="text-white/80 text-[11px] truncate">
                  Limited time offer
                </p>
              </div>
            </div>

            {/* Seats */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Clock className="w-4 h-4 text-white/90" />
              <span className="text-xs font-bold" style={{ color: "#FA2D1A" }}>
                Only 4 Seats Left!
              </span>
            </div>
          </div>

          {/* CTA */}
          <SubscribeButton
            onClick={scrollToWebinarForm}
            ctaLocation="sticky_footer_mobile"
            href="#webinar-lead-form"
            className="w-full !bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
            style={{ backgroundColor: "#FA2D1A" }}
            label={
              <span className="flex items-center gap-2">
                Register Now & Get Access <ArrowRight className="w-5 h-5" />
              </span>
            }
          />
        </div>

        {/* ---------------- DESKTOP ---------------- */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Bonuses */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Free bonuses worth ₹9,999/-
              </p>
              <p className="text-white/80 text-xs">Limited time offer</p>
            </div>
          </div>

          {/* CTA */}
          <SubscribeButton
            onClick={scrollToWebinarForm}
            ctaLocation="sticky_footer_desktop"
            href="#webinar-lead-form"
            className="!bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
            style={{ backgroundColor: "#FA2D1A" }}
            label={
              <span className="flex items-center gap-2">
                Register Now & Get Access <ArrowRight className="w-5 h-5" />
              </span>
            }
          />

          {/* Seats */}
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-white/90" />
            <span className="font-bold" style={{ color: "#FA2D1A" }}>
              Only 4 Seats Left!
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StickyFooter;
