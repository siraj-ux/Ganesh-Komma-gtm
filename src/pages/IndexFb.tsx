import HeroSectionFb from "@/components/webinar/HeroSectionFb";
import ChallengesSection from "@/components/webinar/ChallengesSection";
import LearnSection from "@/components/webinar/LearnSection";
import BonusesSection from "@/components/webinar/BonusesSection";
import TestimonialsSection from "@/components/webinar/TestimonialsSection";
import HowItWorksSection from "@/components/webinar/HowItWorksSection";
import MentorSection from "@/components/webinar/MentorSection";
import GuaranteeSection from "@/components/webinar/GuaranteeSection";
import FAQSection from "@/components/webinar/FAQSection";
import StickyFooter from "@/components/webinar/StickyFooter";
// import { useFacebookPixel } from "@/hooks/usePIxelWatch";
const IndexFb = () => {
    // useFacebookPixel();
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <HeroSectionFb />
      <LearnSection />
      <ChallengesSection />
      <BonusesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <MentorSection />
      <GuaranteeSection />
      <FAQSection />
      <StickyFooter />
      
      {/* Spacer for sticky footer */}
      <div className="h-24 md:h-20" />
    </main>
  );
};

export default IndexFb;