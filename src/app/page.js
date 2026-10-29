import { SERVICE_PAGES } from "@/data/servicePages";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessLd } from "@/lib/schema";
import NavNew from "@/components/sections/new/NavNew";
import HeroNew from "@/components/sections/new/HeroNew";
import FeaturedWork from "@/components/sections/new/FeaturedWork";
import ServicesNew from "@/components/sections/new/ServicesNew";
import AIShowcaseNew from "@/components/sections/new/AIShowcaseNew";
import ProcessNew from "@/components/sections/new/ProcessNew";
import PricingNew from "@/components/sections/new/PricingNew";
import WhyNew from "@/components/sections/new/WhyNew";
import TestimonialsNew from "@/components/sections/new/TestimonialsNew";
import FAQNew from "@/components/sections/new/FAQNew";
import CtaNew from "@/components/sections/new/CtaNew";
import FooterNew from "@/components/sections/new/FooterNew";

export const metadata = {
  alternates: { canonical: "/" },
  title: "Toronto GTA Web Development & SEO Agency | Webhub4U",
  description:
    "Web development, local SEO and custom software for businesses in Toronto and the GTA. Explore Webhub4U's RateFamily platform and Insurimple software project.",
};

export default function Home() {
  return (
    <>
      <JsonLd data={localBusinessLd()} />
      <NavNew />
      <main>
        <HeroNew services={SERVICE_PAGES.map(({ slug, name, question }) => ({ slug, name, question }))} />
        <FeaturedWork />
        <ServicesNew />
        <AIShowcaseNew />
        <ProcessNew />
        <PricingNew />
        <WhyNew />
        <TestimonialsNew />
        <FAQNew />
        <CtaNew />
      </main>
      <FooterNew />
    </>
  );
}
