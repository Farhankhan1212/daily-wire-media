import { Link } from "react-router-dom";

const BreakingTicker = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="bg-crimson text-white flex items-center overflow-hidden">
      <span className="flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider shrink-0 bg-crimson-dark">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse-dot" />
        Breaking
      </span>
      <div className="relative flex-1 overflow-hidden whitespace-nowrap py-2">
        <div className="inline-block animate-ticker">
          {items.map((item, i) => (
            <Link
              key={item._id}
              to={`/news/${item.slug}`}
              className="text-sm font-medium mx-8 hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingTicker;
