import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HeroSlider = ({ slides = [] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;
  const slide = slides[index];

  return (
    <div className="relative h-[420px] md:h-[560px] overflow-hidden rounded-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image?.url || "https://placehold.co/1200x700?text=News"}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-3xl">
            <span className="inline-block bg-crimson text-white text-xs font-bold uppercase tracking-wider px-3 py-1 mb-3">
              {slide.category?.name || "Featured"}
            </span>
            <Link to={`/news/${slide.slug}`}>
              <h2 className="text-white font-display font-bold text-2xl md:text-4xl leading-tight hover:underline">
                {slide.title}
              </h2>
            </Link>
            <p className="text-white/80 mt-3 hidden md:block max-w-xl">{slide.description}</p>
            <p className="dateline text-white/60 mt-3">
              {slide.author} · {new Date(slide.createdAt).toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-crimson text-white p-2 rounded-full"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-crimson text-white p-2 rounded-full"
            aria-label="Next slide"
          >
            <FiChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-6 h-1 rounded-full transition-colors ${i === index ? "bg-crimson" : "bg-white/40"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
