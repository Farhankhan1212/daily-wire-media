import { Helmet } from "react-helmet-async";
import SectionHeader from "../components/SectionHeader";

const Terms = () => (
  <div className="py-8 max-w-3xl mx-auto">
    <Helmet><title>Terms of Service — The Daily Wire Desk</title></Helmet>
    <SectionHeader eyebrow="Legal" title="Terms of Service" />
    <div className="prose dark:prose-invert max-w-none space-y-4 text-[16px] leading-relaxed">
      <p>This placeholder should be replaced with terms reviewed by counsel before launch, covering acceptable use, content ownership, disclaimers, and liability limits.</p>
    </div>
  </div>
);

export default Terms;
