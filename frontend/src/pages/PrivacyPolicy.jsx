import { Helmet } from "react-helmet-async";
import SectionHeader from "../components/SectionHeader";

const PrivacyPolicy = () => (
  <div className="py-8 max-w-3xl mx-auto">
    <Helmet><title>Privacy Policy — The Daily Wire Desk</title></Helmet>
    <SectionHeader eyebrow="Legal" title="Privacy Policy" />
    <div className="prose dark:prose-invert max-w-none space-y-4 text-[16px] leading-relaxed">
      <p>This placeholder policy should be replaced with legal copy reviewed by counsel before launch. It should cover:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>What data is collected (newsletter emails, analytics/view logs, cookies)</li>
        <li>How data is stored and for how long</li>
        <li>Third-party services used (Cloudinary, analytics providers)</li>
        <li>User rights (access, deletion, opt-out of newsletter)</li>
        <li>Contact details for privacy requests</li>
      </ul>
    </div>
  </div>
);

export default PrivacyPolicy;
