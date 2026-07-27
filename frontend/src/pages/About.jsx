import { Helmet } from "react-helmet-async";
import SectionHeader from "../components/SectionHeader";

const About = () => (
  <div className="py-8 max-w-3xl mx-auto">
    <Helmet><title>About Us — The Daily Wire Desk</title></Helmet>
    <SectionHeader eyebrow="Who We Are" title="About The Daily Wire Desk" />
    <div className="prose dark:prose-invert max-w-none text-[17px] leading-relaxed space-y-4">
      <p>
        The Daily Wire Desk is an independent news portal covering politics, business, technology,
        sports, health, education, entertainment, and world affairs. Our newsroom is built around one
        principle: report it fast, but report it right.
      </p>
      <p>
        We publish original reporting, verified wire updates, and analysis from a small team of editors
        and contributors. Every story that runs under a Breaking or Featured tag has been reviewed before
        publication.
      </p>
      <p>
        Have a tip, correction, or story idea? Reach out through our contact page — we read every message.
      </p>
    </div>
  </div>
);

export default About;
