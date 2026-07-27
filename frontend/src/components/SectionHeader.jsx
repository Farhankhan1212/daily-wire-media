import { Link } from "react-router-dom";

const SectionHeader = ({ eyebrow, title, viewAllLink }) => (
  <div className="flex items-end justify-between mb-6 hairline pt-6">
    <div>
      {eyebrow && <p className="section-eyebrow mb-1">{eyebrow}</p>}
      <h2 className="font-display font-bold text-2xl md:text-3xl">{title}</h2>
    </div>
    {viewAllLink && (
      <Link to={viewAllLink} className="text-sm font-semibold hover:text-crimson shrink-0">
        View all →
      </Link>
    )}
  </div>
);

export default SectionHeader;
