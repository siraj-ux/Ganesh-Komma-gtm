import { motion } from "framer-motion";
import { Shield, ArrowRight, Sparkles } from "lucide-react";
import { scrollToWebinarForm } from "@/components/webinar/HeroSection";
import SubscribeButton from "@/components/SubscribeButton";

const GuaranteeSection = () => {
  return (
    <section className="bg-[#FFF3E1] py-8 md:py-10">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-white border border-[#2E4C8C]/10 shadow-lg px-6 py-8 md:px-8 md:py-10 text-center"
        >
          {/* Soft background glow */}
          <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-green-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 bg-[#2E4C8C]/10 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold">
              <Shield className="w-4 h-4" />
              Risk-Free Guarantee
            </div>

            {/* Heading */}
            <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1F2B] mb-4">
              100% Satisfaction Guaranteed
            </h2>

            {/* Price */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="text-lg text-[#3B3F4A] line-through">
                ₹299/-
              </span>
              <div className="flex items-center gap-2 bg-[#FA2D1A]/10 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-[#FA2D1A]" />
                <span className="text-lg font-bold text-[#FA2D1A]">
                  Now FREE
                </span>
              </div>
            </div>

            {/* CTA */}
            <SubscribeButton
              onClick={scrollToWebinarForm}
              ctaLocation="guarantee_section"
              href="#webinar-lead-form"
              className="!bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
              style={{ backgroundColor: "#FA2D1A" }}
              label={
                <span className="flex items-center gap-2">
                  Register Now & Get Access <ArrowRight className="w-5 h-5" />
                </span>
              }
            />

            {/* Bonus reminder */}
            <p className="mt-4 text-xs md:text-sm text-[#3B3F4A]">
              Register now to unlock{" "}
              <span className="font-bold text-[#FA2D1A]">
                FREE bonuses worth ₹9,999/-
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
