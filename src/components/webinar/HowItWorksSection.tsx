import { motion } from "framer-motion";
import { MousePointer, Monitor, Users, ArrowRight } from "lucide-react";
import { scrollToWebinarForm } from "@/components/webinar/HeroSection";
import SubscribeButton from "@/components/SubscribeButton";

const steps = [
  {
    number: 1,
    icon: MousePointer,
    title: "Register Now",
    description:
      "Click on the Register Now button & register for the live Financial Freedom Challenge.",
    color: "#2E4C8C",
  },
  {
    number: 2,
    icon: Monitor,
    title: "Join FFC Group",
    description: "All access details and bonuses will be shared inside the group.",
    color: "#6D5BD0",
  },
  {
    number: 3,
    icon: Users,
    title: "Live Masterclass",
    description:
      "Attend the LIVE session and learn proven stock market frameworks.",
    color: "#2E9C6A",
  },
];



const HowItWorksSection = () => {
  return (
    <section className="relative bg-[#FFF3E1]">
      <div className="container-main py-8 md:py-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center rounded-full border border-[#2E4C8C]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#2E4C8C] mb-2">
            Simple Process
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2E4C8C]">
            How does the Webinar work?
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#2E4C8C]/15 -translate-x-1/2" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45 }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline circle */}
                <motion.div
                  initial={{ scale: 0.6, backgroundColor: "#E5E7EB" }}
                  whileInView={{
                    scale: 1,
                    backgroundColor: step.color,
                  }}
                  transition={{ duration: 0.4 }}
                  className="z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                >
                  {step.number}
                </motion.div>

                {/* Card */}
                <motion.div
                  whileInView={{
                    y: -4,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 rounded-2xl border border-[#2E4C8C]/12 bg-white/70 p-4 md:p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: step.color }}
                    >
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-[#1A1F2B]">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#3B3F4A] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA → FORM */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-8"
        >
          <SubscribeButton
            onClick={scrollToWebinarForm}
            ctaLocation="how_it_works_section"
            href="#webinar-lead-form"
            className="!bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
            style={{ backgroundColor: "#FA2D1A" }}
            label={
              <span className="flex items-center gap-2">
                Register Now & Get Access <ArrowRight className="w-5 h-5" />
              </span>
            }
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
