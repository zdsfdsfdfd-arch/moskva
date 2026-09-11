import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { BeforeAfter } from "@/components/before-after/BeforeAfter";
import { ServicesFacade } from "@/components/services/ServicesFacade";
import { Prices } from "@/components/prices/Prices";
import { Calculator } from "@/components/calculator/Calculator";
import { GlassJourney } from "@/components/3d/GlassJourney";
import { Process } from "@/components/process/Process";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Reviews } from "@/components/reviews/Reviews";
import { Faq } from "@/components/faq/Faq";
import { FinalCta } from "@/components/final-cta/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <TrustStrip />
      <BeforeAfter />
      <ServicesFacade />
      <Prices />
      <Calculator />
      <GlassJourney />
      <Process />
      <Portfolio />
      <Reviews />
      <Faq />
      <FinalCta />
    </>
  );
}
