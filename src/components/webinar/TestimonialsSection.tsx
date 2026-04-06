import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { scrollToWebinarForm } from "@/components/webinar/HeroSection";
import SubscribeButton from "@/components/SubscribeButton";

const videoTestimonials = [
  {
    name: "Amitabh",
    thumbnail: "Learning Stock Market Made Simple",
    youtubeId: "https://youtu.be/D7oqejaCj78?si=uf60UWG1J4jRJCfi",
  },
  {
    name: "Rajib",
    thumbnail: "Great insights shared",
    youtubeId: "https://youtu.be/kAW4WlahEEU?si=fBDcdeL0RCPwyVCK",
  },
  {
    name: "Malikha",
    thumbnail: "2 Hours Financial Freedom Challenge",
    youtubeId: "https://youtu.be/5jW5wJkvf7E?si=0qlDt57b_5ni6xm-",
  },
  {
    name: "Bhavana",
    thumbnail: "Life-changing experience",
    youtubeId: "https://youtu.be/kNYK_Ol9iAE?si=JOb_u_0OWpWyEfLi",
  },
];

const textTestimonials = [
  {
    name: "Swati Gupta",
    location: "IN • 1 review",
    date: "Mar 1, 2025",
    title: "Session was truly enriching",
    text: "Session was truly enriching. Every technical concept was explained in detail. Sir gave us enough confidence to be patient and consistent in this turbulent market. Thank you sir for your guidance and your consistent efforts. Blessed to have such a great mentor!!",
    rating: 5,
    initials: "SG",
  },
  {
    name: "Anil Singhai",
    location: "IN • 4 reviews",
    date: "Mar 1, 2025",
    title: "I like the knowledge imparting with...",
    text: "I like the knowledge imparting with sound knowledge and always showing patience for repetition. always available for help based on the market situation. He loves teaching/imparting knowledge with good hand-holding. Best thing is that he always motivates us for learning, personality development, and health improvement. Continuous multiple msgs not allow us to escape any webinar session.",
    rating: 5,
    initials: "AS",
  },
  {
    name: "kavali naresh kumar",
    location: "IN • 6 reviews",
    date: "Mar 1, 2025",
    title: "Ganesh Komma's knowledge is so sound...",
    text: "Ganesh Komma's knowledge is so sound and perfect and he is very genuine and humble in his approach as a mentor. We are truly blessed to have a mentor like him.",
    rating: 5,
    initials: "KN",
  },
  {
    name: "Jaykishan Joshi",
    location: "IN • 2 reviews",
    date: "Mar 1, 2025",
    title: "Awesome",
    text: "Awesome! A truly dedicated mentor—the best I have ever had in my life. As a disciplined person, I always aspire to be like my mentor, Ganeshji. Hats off to his immense knowledge of investment and trading, as well as his exceptional teaching style. May God bless him with a long and meaningful life, fulfilling all his desires. Thank you!",
    rating: 5,
    initials: "JJ",
  },
];


/** ✅ Extract YouTube video ID from youtu.be / watch?v= / embed links */
function getYouTubeId(input) {
  if (!input) return "";
  // If they pass a raw ID already (11 chars), keep it
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

  try {
    const url = new URL(input);

    // youtu.be/VIDEOID
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").trim();
    }

    // youtube.com/watch?v=VIDEOID
    const v = url.searchParams.get("v");
    if (v) return v;

    // youtube.com/embed/VIDEOID
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];

    return "";
  } catch {
    // fallback regex for weird strings
    const match =
      input.match(/v=([a-zA-Z0-9_-]{11})/) ||
      input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
      input.match(/embed\/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  }
}

// -------- small hook: auto-scroll a horizontal container --------
function useAutoCarouselScroll(ref, { stepPx = 320, intervalMs = 2000 } = {}) {
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer = null;

    const tick = () => {
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + stepPx;

      if (next >= max - 2) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollTo({ left: next, behavior: "smooth" });
    };

    if (!paused && !isDragging) {
      timer = window.setInterval(tick, intervalMs);
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [ref, paused, isDragging, stepPx, intervalMs]);

  const bind = useMemo(
    () => ({
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onTouchStart: () => setIsDragging(true),
      onTouchEnd: () => setIsDragging(false),
      onMouseDown: () => setIsDragging(true),
      onMouseUp: () => setIsDragging(false),
    }),
    []
  );

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepPx, behavior: "smooth" });
  };

  return { bind, scrollBy };
}

const TestimonialsSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const [playingVideo, setPlayingVideo] = useState(null);

  const videoRef = useRef(null);
  const textRef = useRef(null);

  const videoCarousel = useAutoCarouselScroll(videoRef, {
    stepPx: 360,
    intervalMs: prefersReducedMotion ? 999999 : 2000,
  });
  const textCarousel = useAutoCarouselScroll(textRef, {
    stepPx: 420,
    intervalMs: prefersReducedMotion ? 999999 : 2000,
  });

  return (
    <section className="relative" style={{ backgroundColor: "#FFF3E1" }}>
      <div className="container-main py-10 md:py-12 lg:py-14">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8 md:mb-10"
        >
          <span
            className="inline-flex items-center rounded-full border border-[#2E4C8C]/15 bg-white/70 px-3 py-1 text-xs font-semibold mb-3"
            style={{ color: "#2E4C8C" }}
          >
            Social Proof
          </span>

          <h2
            className="text-2xl md:text-3xl font-extrabold mb-1"
            style={{ color: "#2E4C8C" }}
          >
            Here are some of the reviews of my
          </h2>
          <p
            className="text-lg md:text-xl font-bold italic"
            style={{ color: "#1A1F2B" }}
          >
            Webinar Attendees!
          </p>
        </motion.div>

        {/* ---------------- Video Carousel ---------------- */}
        <div className="relative mb-8">
          {/* controls (desktop) */}
          <div className="hidden md:flex absolute -top-12 right-0 gap-2">
            <button
              type="button"
              onClick={() => videoCarousel.scrollBy(-1)}
              className="h-10 w-10 rounded-full border border-[#2E4C8C]/20 bg-white/70 hover:bg-white shadow-sm flex items-center justify-center"
              aria-label="Previous videos"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: "#2E4C8C" }} />
            </button>
            <button
              type="button"
              onClick={() => videoCarousel.scrollBy(1)}
              className="h-10 w-10 rounded-full border border-[#2E4C8C]/20 bg-white/70 hover:bg-white shadow-sm flex items-center justify-center"
              aria-label="Next videos"
            >
              <ChevronRight className="w-5 h-5" style={{ color: "#2E4C8C" }} />
            </button>
          </div>

          <div
            ref={videoRef}
            {...videoCarousel.bind}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            {videoTestimonials.map((video, index) => {
              const id = getYouTubeId(video.youtubeId);
              // ✅ thumbnail preview image (fast)
              const thumb = id
                ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
                : "";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="snap-start min-w-[82%] sm:min-w-[60%] md:min-w-[420px] lg:min-w-[480px]"
                >
                  <div className="aspect-video rounded-2xl overflow-hidden border border-[#2E4C8C]/15 shadow-lg bg-white/40 relative">
                    {playingVideo === index ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
                        title={`Testimonial from ${video.name}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlayingVideo(index)}
                        className="relative w-full h-full group"
                        aria-label={`Play testimonial from ${video.name}`}
                      >
                        {/* ✅ Actual video preview image */}
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`${video.name} testimonial preview`}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#2E4C8C]/20 to-[#FA2D1A]/10" />
                        )}

                        {/* overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/25 transition" />

                        {/* top label */}
                        <div className="absolute top-3 left-3 flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center font-bold border border-[#2E4C8C]/15">
                            <span style={{ color: "#2E4C8C" }}>
                              {video.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-semibold text-white drop-shadow">
                            {video.name}
                          </span>
                        </div>

                        {/* play */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play
                              className="w-6 h-6 text-[#FA2D1A] ml-1"
                              fill="currentColor"
                            />
                          </div>
                        </div>

                        {/* bottom caption */}
                        <p className="absolute bottom-3 left-3 right-3 text-sm text-white drop-shadow">
                          {video.thumbnail}
                        </p>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* divider */}
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-[#2E4C8C]/30 to-transparent" />
        </div>

        {/* ---------------- Text Carousel ---------------- */}
        <div className="relative">
          <div className="hidden md:flex absolute -top-12 right-0 gap-2">
            <button
              type="button"
              onClick={() => textCarousel.scrollBy(-1)}
              className="h-10 w-10 rounded-full border border-[#2E4C8C]/20 bg-white/70 hover:bg-white shadow-sm flex items-center justify-center"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: "#2E4C8C" }} />
            </button>
            <button
              type="button"
              onClick={() => textCarousel.scrollBy(1)}
              className="h-10 w-10 rounded-full border border-[#2E4C8C]/20 bg-white/70 hover:bg-white shadow-sm flex items-center justify-center"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5" style={{ color: "#2E4C8C" }} />
            </button>
          </div>

          <div
            ref={textRef}
            {...textCarousel.bind}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            {textTestimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="snap-start min-w-[88%] sm:min-w-[70%] md:min-w-[520px] lg:min-w-[560px]"
              >
                <div className="relative rounded-2xl border border-[#2E4C8C]/12 bg-white/60 p-5 shadow-lg">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-[#FA2D1A]/15" />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow"
                        style={{ backgroundColor: "#2E4C8C" }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: "#1A1F2B" }}>
                          {t.name}
                        </p>
                        <p className="text-xs" style={{ color: "#3B3F4A" }}>
                          {t.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-[11px] px-2 py-1 rounded-full bg-white/70 border border-[#2E4C8C]/10"
                      style={{ color: "#3B3F4A" }}
                    >
                      {t.date}
                    </span>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#2E4C8C] fill-[#2E4C8C]"
                      />
                    ))}
                  </div>

                  <h4 className="font-bold mb-2" style={{ color: "#2E4C8C" }}>
                    {t.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#3B3F4A" }}
                  >
                    {t.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA → FORM */}
        <div className="text-center mt-8">
          <SubscribeButton
            onClick={scrollToWebinarForm}
            ctaLocation="testimonials_section"
            href="#webinar-lead-form"
            className="!bg-[#FA2D1A] inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md active:scale-[0.99]"
            style={{ backgroundColor: "#FA2D1A" }}
            label={
              <span className="flex items-center gap-2">
                Register Now & Get Access <ArrowRight className="w-5 h-5" />
              </span>
            }
          />
          <p className="mt-3 text-xs" style={{ color: "#3B3F4A" }}>
            Receive bonuses by joining the WhatsApp group.{" "}
            <span className="font-bold" style={{ color: "#FA2D1A" }}>
              Only 4 Seats Left!
            </span>
          </p>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
