import { LandingHero } from "@/components/landing/LandingHero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TemplateGalleryTeaser } from "@/components/landing/TemplateGalleryTeaser";
import { ValueProps } from "@/components/landing/ValueProps";
import { CtaBeat } from "@/components/landing/CtaBeat";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <HowItWorks />
      <TemplateGalleryTeaser />
      <ValueProps />
      <CtaBeat />
      <LandingFooter />
    </main>
  );
}
