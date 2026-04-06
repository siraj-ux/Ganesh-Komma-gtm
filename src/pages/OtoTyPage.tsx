import { useEffect, useState, useRef } from "react"; // Added useRef
import { motion } from "framer-motion";
import {
  Download,
  TrendingUp,
  LineChart,
  FileCheck,
  MessageCircle,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// --- GTM & PRODUCT IMPORTS ---
import { trackPurchase } from "@/utils/gtm";
import { ORDER, GA_PRODUCT_OTO } from "@/utils/product-info";
// -----------------------------

const PROGRAM_CODE = "A1EngFB-WO_OTO_TY";
const WEBINAR_SYNC_URL = `https://webinarsync.gdworkflows.in/sync-webinar?programCode=${encodeURIComponent(
  PROGRAM_CODE
)}`;

declare global {
  interface Window {
    gtag: any;
  }
}

const OtoTyPage = () => {
  /* ---------------- STATE & REFS ---------------- */
  const [waLink, setWaLink] = useState<string>("");
  const [isLoadingLink, setIsLoadingLink] = useState(true);
  const purchaseFired = useRef(false); // Prevents double firing in StrictMode

  /* ---------------- TRACKING & FETCH ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Get Payment ID for Tracking
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment_id") || params.get("razorpay_payment_id") || `txn_oto_${Date.now()}`;

    // 2. GTM PURCHASE TRACKING (GA_PRODUCT_OTO)
    const trackedKey = `gtm_oto_tracked_${paymentId}`;
    if (!localStorage.getItem(trackedKey) && !purchaseFired.current) {
      trackPurchase({
        ...ORDER,
        value: 99, // OTO Price
        transaction_id: paymentId,
        items: [{ ...GA_PRODUCT_OTO }],
      });
      localStorage.setItem(trackedKey, "true");
      purchaseFired.current = true;
      console.log("GTM OTO Purchase Fired ✅");
    }

    // 3. Google Ads Tracking (populated with paymentId)
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-362859026/xNW0CK_00v4bEJKUg60B',
        'transaction_id': paymentId
      });
    }

    // 4. Fetch WhatsApp Link
    let ignore = false;
    async function fetchWaLink() {
      try {
        const res = await fetch(WEBINAR_SYNC_URL);
        const json = await res.json();
        const link = json?.data?.wAGroupJoiningLink || "";
        if (!ignore) {
          setWaLink(link);
          setIsLoadingLink(false);
        }
      } catch (error) {
        console.error("Failed to fetch link", error);
        if (!ignore) setIsLoadingLink(false);
      }
    }

    fetchWaLink();
    return () => { ignore = true; };
  }, []);

  /* ---------------- DATA ---------------- */
  const resources = [
    {
      title: "The Ultimate Financial Research Command Book",
      description: "Your definitive guide to mastering financial research and professional market analysis techniques",
      icon: BookOpen,
      link: "https://drive.google.com/uc?export=download&id=17DuAecF3SOoGrvih8YLPfGLPzU1s4o7T",
    },
    {
      title: "Technical Analysis Prompts",
      description: "Master chart patterns, indicators, and technical trading strategies with AI-powered prompts",
      icon: LineChart,
      link: "https://drive.google.com/uc?export=download&id=1hR9Qsz4EFQsn639FtvFWvbsVvD74Gt4P",
    },
    {
      title: "IPO Investing & Trading",
      description: "Comprehensive prompts for IPO analysis, timing, and trading strategies",
      icon: TrendingUp,
      link: "https://drive.google.com/uc?export=download&id=1xbeapnTu0IbamIAS0948dYkprk7mRg_N",
    },
    {
      title: "Fundamental Screening Criteria",
      description: "Build quality stock screeners with proven fundamental analysis parameters",
      icon: FileCheck,
      link: "https://drive.google.com/uc?export=download&id=1lJicYNrPbf0ONdf7glO5G4OCWC40QmmT",
    },
  ];

  /* ---------------- HANDLERS ---------------- */
  const handleDownload = (title: string, link: string) => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = link;
      document.body.appendChild(iframe);
      setTimeout(() => document.body.contains(iframe) && document.body.removeChild(iframe), 5000);
      toast({ title: "Download Started", description: `${title} is downloading now.` });
    } catch (error) {
      window.location.href = link;
    }
  };

  const handleJoinWhatsapp = () => {
    if (waLink) {
      window.open(waLink, "_blank");
    } else {
      toast({
        variant: "destructive",
        title: "Link not available",
        description: "Please wait a moment or refresh the page."
      });
    }
  };

  return (
    <div className="ty-theme min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full text-sm font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              EXCLUSIVE ONE-TIME OFFER ACTIVATED
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
            Your Premium Resources Are Ready
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Congratulations! You've unlocked exclusive access to professional-grade
            stock market resources worth thousands
          </p>

          <div className="inline-flex items-center gap-2 text-accent font-semibold text-lg">
            <span className="text-3xl">₹99</span>
            <span className="text-muted-foreground line-through">₹4,999</span>
            <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">98% OFF</span>
          </div>
        </motion.div>

        {/* WhatsApp VIP Group Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mb-16"
        >
          <Card className="bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/10 border-[#25D366]/40 p-8 max-w-2xl mx-auto relative overflow-hidden group hover:border-[#25D366]/70 transition-all duration-300">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#25D366]/20 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Join Our Exclusive VIP WhatsApp Group</h3>
              <p className="text-muted-foreground mb-6">Real-time market updates and direct insights from Ganesh Sir</p>

              <Button
                onClick={handleJoinWhatsapp}
                disabled={isLoadingLink}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-8 py-6 text-lg rounded-full transition-all active:scale-95"
              >
                {isLoadingLink ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Join VIP WhatsApp Group"
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Download Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16"
        >
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Card className="relative p-8 flex flex-col items-center text-center h-full bg-card border-border hover:border-primary/50 transition-all duration-300">
                  <div className="mb-6 p-4 bg-background/50 rounded-xl">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground mb-8 flex-grow text-sm leading-relaxed max-w-sm">
                    {resource.description}
                  </p>
                  <Button
                    onClick={() => handleDownload(resource.title, resource.link)}
                    className="w-full md:w-auto px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Now
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30 p-8 max-w-2xl mx-auto">
            <p className="text-lg mb-2 font-medium">
              🎉 <span className="text-primary font-bold">Limited Time Access</span> 🎉
            </p>
            <p className="text-muted-foreground text-sm">
              These resources are exclusively available to OTO members.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OtoTyPage;