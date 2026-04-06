import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";
import { scrollToWebinarForm } from "@/components/webinar/HeroSection";
// ✅ Import SubscribeButton
import SubscribeButton from "@/components/SubscribeButton";

const bonuses = [
  {
    image: "/blueprint.jpg",
    title: "Blueprint of Your Financial Statement",
    originalPrice: "₹2499/-",
  },
  {
    image: "/mindmaps.jpg",
    title: "Practice Worksheets along with Exclusive Mindmaps",
    originalPrice: "₹2502/-",
  },
  {
    image: "/gamifying.png",
    title: "Gamifying The Whole Experience Of Money",
    originalPrice: "₹1999/-",
  },
  {
    image: "/stock.png",
    title: "Identifying Strength in Stocks",
    originalPrice: "₹2999/-",
  },
  {
    image: "/freedom.png",
    title: "Financial Freedom Challenge Workbook",
    originalPrice: "₹1999/-",
  },
];

const BonusesSection = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#2E4C8C" }}
    >
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="absolute top-16 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10 py-10 md:py-12 lg:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Gift className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Exclusive Bonuses</span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            And just for participating, you get{" "}
            <span style={{ color: "#FA2D1A" }}>
              5 BONUSES worth ₹9,999
            </span>{" "}
            absolutely FREE
          </h2>
        </motion.div>

        {/* MOBILE: horizontal scroll | DESKTOP: grid */}
        <div
          className="
            flex gap-4 overflow-x-auto pb-4 -mx-4 px-4
            snap-x snap-mandatory
            md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-5 md:mx-0 md:px-0 md:overflow-visible
            mb-8
          "
        >
          {bonuses.map((bonus, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="
                snap-center
                min-w-[240px] sm:min-w-[260px]
                md:min-w-0
              "
            >
              <div className="h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-3 flex flex-col hover:bg-white/20 transition">
                {/* Image */}
                <div className="rounded-xl overflow-hidden mb-3 bg-white">
                  <img
                    src={bonus.image}
                    alt={bonus.title}
                    loading="lazy"
                    className="w-full h-32 object-contain p-2 transition-transform hover:scale-105"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xs md:text-sm font-semibold text-white text-center flex-1 leading-snug">
                  {bonus.title}
                </h3>

                {/* Price */}
                <div className="text-center mt-2">
                  <span className="line-through text-white/60 text-xs">
                    {bonus.originalPrice}
                  </span>
                  <span
                    className="block font-extrabold text-lg"
                    style={{ color: "#FA2D1A" }}
                  >
                    FREE
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ✅ CTA → UPDATED TO SUBSCRIBE BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <SubscribeButton
            onClick={scrollToWebinarForm}
            ctaLocation="bonuses_section"
            href="#webinar-lead-form"
            className="!bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
            style={{ backgroundColor: "#FA2D1A" }}
            label={
              <span className="flex items-center gap-2">
                Register Now & Get Access <ArrowRight className="w-5 h-5" />
              </span>
            }
          />

          <p className="mt-3 text-xs text-white/80">
            Receive bonuses by joining the WhatsApp group.{" "}
            <span className="font-bold text-white">Only 4 Seats Left!</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BonusesSection;